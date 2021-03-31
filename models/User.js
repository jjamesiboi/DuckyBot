const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
    id: {type: String, required: true, unique: true},
    coins: {type: Number, default: 0},
    nextDaily: {type: Number, default: Date.now}
}, {versionKey: false});

UserSchema.statics.findOneOrCreate = async function(query) {
    return await this.findOneAndUpdate(query, {}, {upsert: true, new: true, setDefaultsOnInsert: true});
}

module.exports = model("User", UserSchema);