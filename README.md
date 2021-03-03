# DuckyBot
DuckyBot is a verification and welcoming Discord bot for your server.

# Features
- Fun - we have fun commands to use
- Verification - verification with captcha, isn't that cool?
- Welcoming - welcome your new members with nice text

# How to install
1) Clone repository
2) Run `npm install`
3) Create .env file
```
DISCORD_TOKEN=bot's token here
DATABASE_URL=mongodb database connection url
```
4) Create config.json file
```json
{
    "prefix": "db!",
    "commandsPerPage": 5,
    "defaultCooldown": 3,
    "maxPrefixLength": 3
}
```

- commandsPerPage - amount of commands to display per page (in help command)
- defaultCooldown - if command's cooldown not specified, default cooldown will be used
- maxPrefixLength - max length of prefix

5) Invite your Discord bot to the server
6) Run `node index.js`