const {prefix: defaultPrefix} = require("../config.json");
const {Schema, model} = require("mongoose");

const verificationSchema = new Schema({
    enabled: {type: Boolean, default: true},
    messageId: String,
    roleId: String
});

const guildSchema = new Schema({
    id: {type: String, required: true, unique: true},
    prefix: {type: String, default: defaultPrefix},
    verification: verificationSchema
}, {versionKey: false});

module.exports = model("Guild", guildSchema);