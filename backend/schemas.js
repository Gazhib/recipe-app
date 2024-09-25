/* eslint-disable no-undef */
const { Schema } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const refreshTokenSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

const foodSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  recipeName: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: Array,
    of: {
      type: String,
    },
    required: true,
  },
  readyIn: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
});

module.exports = { userSchema, refreshTokenSchema, foodSchema };
