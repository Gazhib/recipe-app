/* eslint-disable no-undef */
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { userSchema, foodSchema } = require("./schemas.js");
const { refreshTokenSchema } = require("./schemas.js");

require("dotenv").config({ path: "../.env" });
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = process.env.DB_CONNECTION;
const processKey = process.env.PROCESS_KEY;
const refreshKey = process.env.REFRESH_KEY;

const User = mongoose.model("users", userSchema, "users");

const RefreshTokens = mongoose.model(
  "refreshTokens",
  refreshTokenSchema,
  "refreshTokens"
);

const Food = mongoose.model("foodRecipes", foodSchema, "foodRecipes");

async function connectDatabase() {
  await mongoose.connect(db);
  console.log("Connected to database");
}
connectDatabase();

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json("You are not authenticated");
  }
  const authToken = authHeader.split(" ")[1];
  jwt.verify(authToken, processKey, (err, data) => {
    if (err) {
      return res.status(403).json("Token is invalid");
    }

    req.user = data.username;
    req.email = data.email;
    next();
  });
}

function nameValidator(word) {
  if (word.trim() === "") {
    return false;
  }
  return true;
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

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json("Email is not registered yet");
  }
  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) {
    return res.status(401).json("Incorrect password");
  }

  const userPayload = {
    email,
    username: user.username,
    jti: uuidv4(),
  };

  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  const refreshTokens = await RefreshTokens.findOne({ email });

  if (!refreshTokens) {
    const newRefreshToken = new RefreshTokens({
      email,
      refreshToken,
    });
    await newRefreshToken.save();
  } else {
    refreshTokens.refreshToken = refreshToken;
    await refreshTokens.save();
  }

  res.json({ username: user.username, email, accessToken, refreshToken });
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

  if (user.trim() === "") {
    return res.status(400).json("Username can not be empty");
  }
  if (password.trim() === "" || password.trim() !== password) {
    return res.status(400).json("Password is irrelevant");
  }

  const hashedPassword = await hashPassword(password);

  const userPayload = {
    email,
    username,
    jti: uuidv4(),
  };

  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);
  const newRefreshToken = new RefreshTokens({
    email,
    refreshToken,
  });
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  await newRefreshToken.save();
  res.json({ username, email, accessToken, refreshToken });
});

app.post("/api/logout", verifyToken, async (req, res) => {
  const refreshToken = req.body.token;
  const refreshTokensDb = await RefreshTokens.findOne({ refreshToken });
  if (refreshTokensDb) {
    refreshTokensDb.deleteOne({ refreshToken });
  }
  res.status(200).json("You logged out successfully");
});

app.post("/api/refresh", async (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(401).json("You are not authenticated");
  }

  const refreshTokens = await RefreshTokens.findOne({ refreshToken });

  if (!refreshTokens) {
    return res.status(403).json("Refresh token is not valid");
  }

  jwt.verify(refreshToken, refreshKey, async (err, user) => {
    if (err) {
      return err;
    }
    console.log(refreshToken);
    await refreshTokens.deleteOne({ refreshToken });

    user.jti = uuidv4();
    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      accessToken: newAccessToken,
    });
  });
});

app.post("/add-recipe", verifyToken, async (req, res) => {
  const {
    author,
    name,
    ingredients,
    description,
    instructions,
    readyIn,
    servings,
  } = req.body;

  const requiredFields = { name, instructions, readyIn, servings };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (!nameValidator(value)) {
      return res
        .status(400)
        .json(
          `${
            key.charAt(0).toUpperCase() + key.slice(1)
          } cannot be empty. Write something`
        );
    }
  }
  ingredients.filter((ingredient) => ingredient.trim() !== "");
  if (ingredients.length === 0) {
    return res.status(400).json("Add some ingredients");
  }

  const newRecipe = new Food({
    author,
    recipeName: name,
    ingredients,
    instructions,
    description,
    readyIn,
    servings,
  });

  try {
    await newRecipe.save();
  } catch (e) {
    return res.json(e);
  }

  res.status(200).json("Successfully added your recipe");
});

app.get("/get-community-recipes", async (req, res) => {
  const recipes = await Food.find().limit(10);
  console.log(recipes);
  return res.status(200).json(recipes);
});

app.listen(3000, () => {
  console.log("server is running on http://localhost/3000");
});
