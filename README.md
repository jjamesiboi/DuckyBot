# DuckyBot
DuckyBot is a verification and welcoming Discord bot for your server.

# Developers
Thanks to our great developers for making this bot, we are a team of 3 developers/staff.

- hufeepufee123 - Descritpion of me here
- Just Dan - Description of me here
- Jamesiboi - JavaScript developer, newbie html and css developer. Founder of DuckyBot.
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
4) Edit config.json file as you want (optional)
```json
{
    "prefix": "db!",

    "commandsPerPage": 5,
    "defaultCooldown": 3,
    "maxPrefixLength": 3,

    "captchaLength": 6,
    "captchaWidth": 300,
    "captchaHeight": 150,
    "captchaTries": 2,
    "defaultVerificationMessage": "Hello! This server has a verification system, In order to verify, you need to complete the captcha sent down below. Please enter the Text on the image, remember this is case sensitive."
}
```

- prefix - prefix of the bot

- commandsPerPage - amount of commands to display per page (in help command)
- defaultCooldown - if command's cooldown not specified, default cooldown will be used
- maxPrefixLength - max length of prefix

- captchaLength - length of captcha
- captchaWidth - width of captcha
- captchaHeight - height of captcha
- captchaTries - amount of tries to complete the captcha
- defaultVerificationMessage - default message for verification

5) Invite your Discord bot to the server
6) Run `node index.js`
