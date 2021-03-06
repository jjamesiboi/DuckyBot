const {MessageEmbed} = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "thispersondoesnotexist",
    description: "Sends a image from thispersondoesnotexist.com",

    async execute(client, message) {
        const resp = await fetch("https://thispersondoesnotexist.com);
        const {url} = await resp.json();

        const embed = new MessageEmbed()
        .setTitle("It looks real!")
            .setColor("RANDOM")
            .setImage(url)
            .setFooter(`Powered by thispersondoesnotexist.com`);

        message.channel.send(embed);
    }
};
