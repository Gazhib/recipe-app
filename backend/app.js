/* eslint-disable no-undef */
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const { Schema, default: mongoose } = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = process.env.DB_CONNECTION;
const processKey = process.env.PROCESS_KEY;
const refreshKey = process.env.REFRESH_KEY;

async function connectDatabase() {
  await mongoose.connect(db);
  console.log("Connected to database");
}
connectDatabase();

let refreshTokens = [];

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json("You are not authenticated");
  }
  const authToken = authHeader.split(" ")[1];
  jwt.verify(authToken, processKey, (err, data) => {
    if (err) {
      return res.status(403).json("Token is unvalid");
    }

    req.user = data.username;
    req.email = data.email;
    next();
  });
}

function generateAccessToken(user) {
  const accessToken = jwt.sign(user, processKey, {
    expiresIn: "1h",
  });
  return accessToken;
}

function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, refreshKey);
  return refreshToken;
}

async function hashPassword(password) {
  const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

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

const User = mongoose.model("users", userSchema, "users");

app.post("/api/login", async (req, res) => {
  const { email, password, username } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json("Email is not registered yet");
  }
  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) {
    return res.status(401).json("Incorrect password");
  }

  const accessToken = generateAccessToken({ email, username });
  const refreshToken = generateRefreshToken({ email, username });

  res.json({ email, username, accessToken, refreshToken });
});

app.post("/api/registration", async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;
  if (confirmPassword !== password) {
    return res.status(400).json("Passwords do not match");
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json("The email is already registered");
  }
  const hashedPassword = await hashPassword(password);

  const accessToken = generateAccessToken({ email, username });
  const refreshToken = generateRefreshToken({ email, username });
  refreshTokens.push(refreshToken);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  res.json({ username, email, accessToken, refreshToken });
});

app.post("/api/logout", verifyToken, (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json("You logged out successfully");
});

app.post("/api/refresh", (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(401).json("You are not authenticated");
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid");
  }

  jwt.verify(refreshToken, refreshKey, (err, user) => {
    if (err) {
      return err;
    }

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
});

app.listen(3000, () => {
  console.log("server is running on http://localhost/3000");
});
