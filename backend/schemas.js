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
  recipes: {
    type: Array,
    default: [],
  },
  imageName: {
    type: String,
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
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  analyzedInstructions: {
    type: Array,
    of: {
      type: String,
    },
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  extendedIngredients: {
    type: Array,
    of: {
      type: String,
    },
    required: true,
  },
  readyInMinutes: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  imageName: {
    type: String,
    required: true,
  },
});

module.exports = { userSchema, refreshTokenSchema, foodSchema };
