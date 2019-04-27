// DB connection setup
const {DB_SERVER, DB_PORT, DB_NAME} = require("./constants");
const mongoose = require("mongoose");
mongoose.connect(`mongodb://${DB_SERVER}:${DB_PORT}/${DB_NAME}`, { useNewUrlParser: true });

// mongoose User schema/User model creation, User model export
// 'timestamps' is 'true' to provide 'createdAt: Date' and 'updatedAt: Date' values for free
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