# imap.clean-inbox

Clean your IMAP inbox automatically!

This script will move old and seen mails into an archive.  
You could exclude flagged emails and set custom archives on a year base.

## Install

Just clone the repo:

```bash
git clone https://github.com/xairoo/imap.clean-inbox.git
```

## Configuration

Create your own configuration inside `config/default.json`.  
You could add multiple accounts and services.

```json
{
  "accounts": [
    {
      "auth": { "user": "example@gmail.com", "pass": "password" },
      "host": "gmail.com",
      "port": 993,
      "secure": true,
      "archive": ["Archive", "{YEAR}"],
      "ignoreFlags": ["\\Flagged"],
      "age": 604800
    }
  ]
}
```

## Usage

```bash
npm run start
```

Feel free to run this as a cronjob.
