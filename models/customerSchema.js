const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//define the Schema (the structure of the article)
const customerSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    age: String,
    country: String,
    gender: String,
  },
  { timestamps: true }
);

//create a model based on that Schema
const Customer = mongoose.model("customer", customerSchema);

module.exports = Customer;
