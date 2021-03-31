const {prefix: defaultPrefix} = require("@root/config.json");
const {Schema, model} = require("mongoose");

const VerificationSchema = new Schema({
    enabled: {type: Boolean, default: false},
    message: String,
    roleId: String,
    channelId: String
});

const GuildSchema = new Schema({
    id: {type: String, required: true, unique: true},
    prefix: {type: String, default: defaultPrefix},
    verification: VerificationSchema
}, {versionKey: false});

GuildSchema.statics.findOneOrCreate = async function(query) {
    return await this.findOneAndUpdate(query, {}, {upsert: true, new: true, setDefaultsOnInsert: true});
}

module.exports = model("Guild", GuildSchema);