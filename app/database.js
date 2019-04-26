const {DB_SERVER, DB_PORT, DB_NAME} = require("./constants");

const mongoose = require("mongoose");
mongoose.connect(`mongodb://${DB_SERVER}:${DB_PORT}/${DB_NAME}`, { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  profileId: String,
  email: String,
  fullName: String,
  description: String
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = {
    User
};