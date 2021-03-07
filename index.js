require("dotenv").config();

const config = require("./config.json");

const fs = require("fs");
const mongoose = require("mongoose");
const Guild = require("./models/Guild.js");

const Discord = require("discord.js");
const client = new Discord.Client({
    ws: {intents: [Discord.Intents.NON_PRIVILEGED, "GUILD_MEMBERS"]}
});

client.commands = new Discord.Collection();
client.cooldowns = new Map();

process.on("unhandledRejection", err => console.log(err));

client.on("ready", async () => {
    console.log("Bot is ready.");

    client.user.setActivity("In development! You should check me out :eyes: oo", {
        type: "STREAMING",
        url: "https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=DeeckPeeck"
    });
});

client.on("message", async message => {
    if (message.channel.type === "dm") return;

    const dbGuild = await Guild.findOne({id: message.guild.id});
    const prefix = dbGuild ? dbGuild.prefix : config.prefix;

    if (!message.content.startsWith(prefix)) return;

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

                    return message.reply(`Wait ${timeLeft.toFixed(1)} more second(s) before using this command again.`);
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
        useCreateIndex: true,
        useFindAndModify: false
    });

    console.log("Loading categories and commands...");

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

    console.log("Loading modifiers...");

    const modifiers = fs.readdirSync(`${__dirname}/modifiers`);

    for (const modifier of modifiers) {
        if (!modifier.endsWith(".js")) continue;
        require(`${__dirname}/modifiers/${modifier}`)(client);
    }

    client.login(process.env.DISCORD_TOKEN);
}

start();
