<div align="center">
  <h1>imap.clean-inbox</h1>
  <p>Clean your IMAP inbox automatically</p>
</div>

# Install

Just clone the repo:

```
git clone https://github.com/xairoo/imap.clean-inbox.git
```

## Configuration

Create your own configuration inside `config/default.json`.
You could add multiple accounts and services.

```
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

```
npm run start
```

Feel free to run this as a cronjob.
