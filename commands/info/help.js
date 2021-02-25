const {MessageEmbed} = require("discord.js");
const {commandsPerPage} = require("../../config.json");

module.exports = {
    name: "help",
    description: "Shows list of categories and commands",

    execute(client, message, args) {
        const categoryName = args[0];

        if (!categoryName) {
            const embed = new MessageEmbed()
                .setTitle("Help")
                .setDescription("List of all categories")
                .setColor("YELLOW")
                .setTimestamp();

            for (const category of client.commands.values())
                embed.addField("`" + category.name + "`", "Some description");

            message.channel.send(embed);
        } else {
            const category = client.commands.get(categoryName);

            if (!category)
                return message.channel.send(":x: I couldn't find this category.");

            const commands = Array.from(category.values());

            const totalPages = Math.ceil(commands.length / commandsPerPage);
            const page = parseInt(args[1]) || 1;

            if (page < 1 || page > totalPages)
                return message.channel.send(":x: Invalid page.");

            const embed = new MessageEmbed()
                .setTitle("Help")
                .setDescription("List of all commands for `" + categoryName + "` category")
                .setColor("YELLOW")
                .setFooter(`Page: ${page}/${totalPages}`)
                .setTimestamp();

            for (let i = (page - 1) * commandsPerPage; i < page * commandsPerPage; ++i) {
                const command = commands[i];
                if (!command) break;

                let value = command.name;
                if (command.usage)
                    value += ` ${command.usage}`;

                embed.addField(`\`\`\`${value}\`\`\``, command.description);
            }

            message.channel.send(embed);
        }
    }
};