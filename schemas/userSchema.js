const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Users = require("../models/userModel");

const UsersSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

module.exports = UsersSchema;
