const {MessageEmbed} = require("discord.js");
const randomPuppy = require("random-puppy");

const subReddits = ["dankmeme", "meme", "me_irl"];

module.exports = {
    name: "meme",
    description: "Sends a meme image",

    async execute(client, message) {
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];

        const img = await randomPuppy(random);
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setImage(img)
            .setTitle("Meme!")
            .setURL(`https://reddit.com/r/${random}`);

        message.channel.send(embed);
    }
}
