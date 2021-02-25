require("dotenv").config();

const fs = require("fs");
const {prefix} = require("./config.json");
const mongoose = require("mongoose");

const Discord = require("discord.js");
const client = new Discord.Client();

client.commands = new Discord.Collection();
client.cooldowns = new Map();

process.on("unhandledRejection", err => console.log(err));

client.on("ready", () => {
    console.log("Bot is ready.");
});

client.on("message", message => {
    const args = message.content.slice(prefix.length).trim().split(" ");
    const commandName = args.shift().toLowerCase();

    for (const category of client.commands.values()) {
        for (const command of category.values()) {
            if (command.name !== commandName) continue;
            if (command.guildOnly && message.channel.type === "dm") break;

            if (command.permissions) {
                for (const permission of command.permissions) {
                    if (!message.member.permissions.has(permission)) {
                        const permissionStr = command.permissions.map(perm => {
                            return `**${perm.split("_").map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(" ")}**`;
                        }).join(", ");
                        return message.channel.send(`:x: You need these permissions to use this command:\n${permissionStr}.`);
                    }
                }
            }

            const argsRequired = command.argsRequired || 0;
            if (args.length < argsRequired)
                return message.channel.send(`:x: Usage: ${config.prefix}${command.name} ${command.usage}.`);

            if (!client.cooldowns.has(command.name))
                client.cooldowns.set(command.name, new Map());

            const now = Date.now();
            const timestamps = client.cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || config.defaultCooldown) * 1000;

            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;

                    return message.reply(`wait ${timeLeft.toFixed(1)} more second(s) before using this command again.`);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

            command.execute(client, message, args);
        }
    }
});

async function start() {
    console.log("Connecting to database...");

    await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

    console.log("Loading categories...");

    const categories = fs.readdirSync(`${__dirname}/commands`, {withFileTypes: true});

    for (const categoryFolder of categories) {
        if (!categoryFolder.isDirectory()) continue;

        const category = new Discord.Collection();
        category.name = categoryFolder.name;

        const commands = fs.readdirSync(`${__dirname}/commands/${categoryFolder.name}`);
        for (const commandFile of commands) {
            if (!commandFile.endsWith(".js")) continue;

            const command = require(`${__dirname}/commands/${categoryFolder.name}/${commandFile}`);
            category.set(command.name, command);
        }

        client.commands.set(category.name, category);
    }

    client.login(process.env.DISCORD_TOKEN);
}

start();