const {MessageEmbed} = require("discord.js");
const User = require("@models/User.js");

module.exports = {
    name: "balance",
    description: "View your balance, or someone elses",
    
    async execute(client, message) {
        const {coins} = await User.findOneOrCreate({id: message.author.id});

        const embed = new MessageEmbed()
            .setColor("YELLOW")
            .setTitle(`${message.author.username} balance`)
            .addFields(
                {name: "`Coins`", value: coins},
                {name: "`Bank`", value: 0}
            )
            .setTimestamp();

        message.channel.send(embed);
    }
}