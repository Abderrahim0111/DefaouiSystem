const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const authSchema = new Schema({
  username: String,
  email: String,
  password: String,
  customerInfo: [
    {
      firstName: String,
      lastName: String,
      email: String,
      phoneNumber: String,
      age: String,
      country: String,
      gender: String,
      createdAt : Date,
      updatedAt: { type: Date, default: Date.now }
    },
  ],
  profileImgUrl: String,
});

authSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const CustomerAuth = mongoose.model("user", authSchema);

module.exports = CustomerAuth;
