const User = require("@models/User.js");
const ms = require("ms");

module.exports = {
    name: "daily",
    description: "Claim your daily reward",

    async execute(client, message) {
        const dbUser = await User.findOneOrCreate({id: message.author.id});
        const currentTime = Date.now();

        if (currentTime >= dbUser.nextDaily) {
            dbUser.coins += 100;
            dbUser.nextDaily = currentTime + 86400000;
            dbUser.save();

            message.channel.send(":white_check_mark: You claimed your daily reward (100 coins).");
        } else {
            const claimAfter = ms(dbUser.nextDaily - currentTime);
            message.channel.send(`:x: You can claim your daily reward after ${claimAfter}.`);
        }
    }
};