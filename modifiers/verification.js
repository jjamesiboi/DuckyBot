const Captcha = require("captchapng");
const Guild = require("../models/Guild.js");
const {MessageAttachment} = require("discord.js");

const {
       captchaLength,
       captchaWidth,
       captchaHeight,
       captchaTries,
       defaultVerificationMessage
      } = require("../config.json");

const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

function generateCode(length) {
    let code = "";

    for (let i = 0; i < length; ++i) code += characters[Math.floor(Math.random() * characters.length)];
    return code;
}

module.exports = client => {
    client.on("guildMemberAdd", async member => {
        const dbGuild = await Guild.findOne({id: member.guild.id});
        if (!dbGuild || !dbGuild.verification || !dbGuild.verification.enabled) return;

        const code = (Math.random() * 900000 + Math.pow(10, captchaLength - 1)).toFixed();

        const captcha = new Captcha(captchaWidth, captchaHeight, code);
        captcha.color(0, 0, 0, 0);
        captcha.color(80, 80, 80, 255);

        const img = captcha.getBase64();
        const buffer = Buffer.from(img, "base64");

        try {
            const attachment = new MessageAttachment(buffer, "captcha.png");
            const message = dbGuild.verification.message || defaultVerificationMessage;

            await member.send(message, attachment);
        } catch (err) {
            if (err.name === "Cannot send messages to this user") {
                const notificationChannel = member.guild.channels.cache.get(dbGuild.verification.channelId);

                return notificationChannel.send(`:x: ${member}, This server has a verification system, we wanted to send you a DM/PM with a captcha but we cant :tired_face:! Please open your DM's/PM's And try again! https://gyazo.com/ba952e813b92bb62422e3ac05160a7ff`);
            }
        }

        const filter = msg => msg.author.id === member.id;
        let tries = captchaTries;

        while (true) {
            let message;

            try {
                const collected = await member.user.dmChannel.awaitMessages(filter, {max: 1, time: 30000, errors: ["time"]});
                message = collected.first();
            } catch (err) {
                member.send(":x: Time's up.");
                member.kick("Failed the verification");

                break;
            }

            if (message.content === code) {
                const role = await member.guild.roles.fetch(dbGuild.verification.roleId);

                member.roles.add(role);
                member.send(":white_check_mark: You successfully verified in the server, and was given the role.");

                break;
            } else {
                member.send(":x: Invalid captcha code.");
                --tries;
            }

            if (tries == 0) {
                member.send(":x: You failed the verification process.");
                member.kick("Failed the verification");

                break;
            }
        }
    });
};
