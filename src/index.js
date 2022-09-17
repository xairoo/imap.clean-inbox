const config = require("config");
const { ImapFlow } = require("imapflow");

config.accounts.forEach((account) => {
  const client = new ImapFlow({
    //
    ...account,
    logger: false,
  });

  const main = async () => {
    // Wait until client connects and authorizes
    await client.connect();

    let messages = [];
    let mailboxes = await client.list();

    mailboxes = mailboxes.map((mailbox) => {
      return mailbox.path;
    });

    // Select and lock a mailbox. Throws if mailbox does not exist
    await client.mailboxOpen("INBOX");
    try {
      for await (let message of client.fetch("1:*", {
        envelope: true,
        flags: true,
      })) {
        const current = new Date();
        const diff = (current - message.envelope.date) / 1000;

        // Move only mails that are old enough
        if (diff >= account.age) {
          // Move only seen messages
          if (message.flags.has("\\Seen")) {
            // Skip messages with ignored flags
            const multipleExist = account.ignoreFlags.every((value) => {
              return message.flags.has(value);
            });

            if (!multipleExist) {
              messages.push({
                uid: message.uid,
                date: message.envelope.date,
                subject: message.envelope.subject,
              });
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }

    for await (let message of messages) {
      const archive = account.archive.map((path) => {
        if (path === "{YEAR}") {
          let date = new Date(message.date).getFullYear();
          return date;
        } else {
          return path;
        }
      });

      // Create missing mailbox
      if (!mailboxes.includes(archive.join(client.namespace.delimiter))) {
        try {
          const info = await client.mailboxCreate(archive);
          if (info.created) {
            // Append created archive to mailboxes array
            mailboxes.push(archive.join(client.namespace.delimiter));
          }
        } catch (err) {
          console.log(err);
        }
      }

      if (mailboxes.includes(archive.join(client.namespace.delimiter))) {
        try {
          await client.messageMove(
            message.uid,
            archive.join(client.namespace.delimiter),
            { uid: true }
          );
          console.log({
            subject: message.subject,
            date: message.date,
            archive: archive.join(client.namespace.delimiter),
            status: "moved",
          });
        } catch (err) {
          console.log(err);
        }
      }
    }

    // Log out and close connection
    await client.logout();
  };

  main().catch((err) => {
    console.log(err);
  });
});
