const Captcha = require("captchapng");
const Guild = require("../models/Guild.js");
const {MessageAttachment} = require("discord.js");

const {captchaWidth, captchaHeight, defaultVerificationMessage} = require("../config.json");

module.exports = client => {
    client.on("guildMemberAdd", async member => {
        const dbGuild = await Guild.findOne({id: member.guild.id});
        if (!dbGuild || !dbGuild.verification) return;

        const code = (Math.random() * 900000 + 100000).toFixed();

        const captcha = new Captcha(captchaWidth, captchaHeight, code);
        captcha.color(0, 0, 0, 0);
        captcha.color(80, 80, 80, 255);

        const img = captcha.getBase64();
        const buffer = Buffer.from(img, "base64");

        const attachment = new MessageAttachment(buffer, "captcha.png");
        const message = dbGuild.verification.message || defaultVerificationMessage;

        await member.send(message, attachment);

        const filter = msg => msg.author.id === member.id;
        let tries = 3;

        while (true) {
            let message;
            try {
                message = (await member.user.dmChannel.awaitMessages(filter, {max: 1, time: 30000})).first();
            } catch (err) {
                member.user.dmChannel.send(":x: Time's up.");
                break;
            }

            if (message.content === code) {
                const role = await member.guild.roles.fetch(dbGuild.verification.roleId);
                member.roles.add(role);

                member.user.dmChannel.send(":white_check_mark: You successfully verified in the server, and was given the role.");

                break;
            } else {
                member.user.dmChannel.send(":x: Invalid captcha code.");
                --tries;
            }

<<<<<<< HEAD
            if (tries == 0) {
                member.user.dmChannel.send(":x: You failed the verification.");
=======
            if (tries == 3) {
                member.user.dmChannel.send(":x: You failed the verification process .");
>>>>>>> 64b8855cd1e65a6e168af3288dde701009ed4dfe
                break;
            }
        }
    });
};
