const {MessageEmbed} = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "duck",
    description: "Sends duck image",

    async execute(client, message) {
        const resp = await fetch("https://random-d.uk/api/v2/random");
        const {url} = await resp.json();

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setImage(url)
            .setFooter(`Powered by random-d.uk`);

        message.channel.send(embed);
    }
};