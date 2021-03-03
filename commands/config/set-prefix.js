const {maxPrefixLength} = require("../../config.json");
const Guild = require("../../models/Guild.js");

module.exports = {
    name: "set-prefix",
    description: "Sets bot's prefix",
    argsRequired: 1,
    
    async execute(client, message, args) {
        if (args.length > maxPrefixLength)
            return message.channel.send(`:x: Max length of prefix: ${maxPrefixLength}`);
        
        await Guild.findOneAndUpdate({id: message.guild.id}, {$set: {"prefix": args[0]}}, {upsert: true});
        message.channel.send(":white_check_mark: Set bot's prefix.");
    }
};