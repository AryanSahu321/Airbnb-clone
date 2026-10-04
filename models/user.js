const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
});

userSchema.plugin(passportLocalMongoose);
// hasing ,salting , autmaticaly implied
// provide setpassword method, getpassword method
//and authenticate method

module.exports = mongoose.model("User", userSchema);
