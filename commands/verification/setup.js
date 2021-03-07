const {MessageEmbed, DiscordAPIError} = require("discord.js");
const Guild = require("../../models/Guild.js");

module.exports = {
    name: "setup",
    description: "Setup verification for your server",
    permissions: ["MANAGE_ROLES"],

    async execute(client, message, args) {
        if (!args.length || typeof args[0] !== "string") {
            const dbGuild = await Guild.findOne({id: message.guild.id});
            const isEnabled = dbGuild ? dbGuild.verification.enabled === true : false;

            const embed = new MessageEmbed()
                .setTitle("Setup")
                .setColor("RANDOM")
                .setFooter(`Verification is ${isEnabled ? "enabled" : "not enabled"}.`)
                .setTimestamp()
                .addFields(
                    {
                        name: "`setup message <message>`",
                        value: "Set verification message"
                    },

                    {
                        name: "`setup role <role>`",
                        value: "Set verification role",
                    },

                    {
                        name: "`setup notification-channel <channel>`",
                        value: "Set notification channel (if user's DM are closed, this channel will be used to tell them)"
                    },

                    {
                        name: "`setup enable`",
                        value: "Enables verification system"
                    },

                    {
                        name: "`setup disable`",
                        value: "Disables verification system",
                    }
                );

            return message.channel.send(embed);
        }

        const option = args[0].toLowerCase();

        switch (option) {
            case "message": {
                // TODO: Check if the guild has premium

                const text = args.slice(1).join(" ");

                if (!text)
                    return message.channel.send(":x: I didn't find any message.");

                await Guild.findOneAndUpdate({id: message.guild.id}, {$set: {"verification.message": text}}, {upsert: true});
                return message.channel.send(":white_check_mark: Set verification message.");
            }

            case "role": {
                const mentionedRole = message.mentions.roles.first();
                const roleId = mentionedRole ? mentionedRole.id : args[1];

                if (!message.guild.roles.cache.has(roleId))
                    return message.channel.send(":x: Unknown role.");

                await Guild.findOneAndUpdate({id: message.guild.id}, {$set: {"verification.roleId": roleId}}, {upsert: true});
                return message.channel.send(":white_check_mark: Set verification role.");
            }

            case "notification-channel": {
                const channel = message.mentions.channels.first();

                if (!channel)
                    return message.channel.send(":x: Unknown channel.");

                await Guild.findOneAndUpdate({id: message.guild.id}, {$set: {"verification.channelId": channel.id}}, {upsert: true});
                return message.channel.send(":white_check_mark: Set verification channel.");
            }

            case "enable": {
                const dbGuild = await Guild.findOneAndUpdate({id: message.guild.id}, {}, {upsert: true});

                if (!dbGuild.verification.message)
                    return message.channel.send(":x: You need to set message.");

                if (!dbGuild.verification.roleId)
                    return message.channel.send(":x: You need to set role.");

                if (!dbGuild.verification.channelId)
                    return message.channel.send(":x: You need to set notification channel.");

                dbGuild.verification.enabled = true;
                dbGuild.save();

                return message.channel.send(":white_check_mark: Enabled verification.");
            }

            case "disable": {
                await Guild.findOneAndUpdate({id: message.guild.id}, {$set: {"verification.enabled": false}}, {upsert: true});
                return message.channel.send(":white_check_mark: Disabled verification.");
            }

            default: {
                return message.channel.send(":x: Unknown option.");
            }
        }
    }
};