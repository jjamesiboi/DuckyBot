const {MessageEmbed, MessageAttachment} = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "thispersondoesnotexist",
    description: "Sends a image from thispersondoesnotexist.com",

    async execute(client, message) {
        const attachment = new MessageAttachment("https://thispersondoesnotexist.com/image", "person.png");

        const embed = new MessageEmbed()
            .setTitle("It looks real!")
            .setColor("RANDOM")
            .attachFiles([attachment])
            .setImage("attachment://person.png")
            .setFooter(`Powered by thispersondoesnotexist.com`);

        message.channel.send(embed);
    }
};
