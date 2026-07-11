const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongooseImport = require("passport-local-mongoose");
const passportLocalMongoose =
  typeof passportLocalMongooseImport === "function"
    ? passportLocalMongooseImport
    : passportLocalMongooseImport.default || passportLocalMongooseImport;

const userSchema = new Schema({
  username: {
    type: String,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  usernameUnique: false,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
