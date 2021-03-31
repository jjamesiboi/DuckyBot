const User = require("@models/User.js");

module.exports = {
    name: "beg",
    description: "Beg for coins, maybe someone will help you",
    cooldown: 120,

    async execute(client, message) {
        const chance = Math.random();

        if (chance <= 0.4) {
            const amountOfCoins = Math.floor(Math.random() * 20) + 1;

            await User.findOneAndUpdate({id: message.author.id}, {$inc: {coins: amountOfCoins}}, {upsert: true});
            message.channel.send(`Some good person gave you ${amountOfCoins} coins :hushed:`);
        } else {
            message.channel.send("Nobody gave you coins. Sadly :cry:");
        }
    }
};