/* eslint-disable no-undef */
const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const app = express();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { userSchema, foodSchema } = require("./schemas.js");
const { refreshTokenSchema } = require("./schemas.js");
const multer = require("multer");

require("dotenv").config({ path: "../.env" });
const allowedOrigins = ["https://gazhib.github.io", "http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());
app.use(express.static("public"));

const db = process.env.DB_CONNECTION;
const processKey = process.env.PROCESS_KEY;
const refreshKey = process.env.REFRESH_KEY;

const bucketName = process.env.BUCKET_NAME;
const bucketLocation = process.env.BUCKET_LOCATION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey,
  },
  region: bucketLocation,
});

const User = mongoose.model("users", userSchema, "users");

const RefreshTokens = mongoose.model(
  "refreshTokens",
  refreshTokenSchema,
  "refreshTokens"
);

const Food = mongoose.model("foodRecipes", foodSchema, "foodRecipes");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
  if (!word || word.trim() === "") {
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
  const usernameChecker = await User.findOne({ username });
  if (user) {
    return res.status(409).json("The email is already registered");
  }

  if (usernameChecker) {
    return res.status(409).json("The username is already registered");
  }

  if (username.trim() === "") {
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
    await refreshTokens.deleteOne({ refreshToken });

    user.jti = uuidv4();
    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      accessToken: newAccessToken,
    });
  });
});

app.post(
  "/add-recipe",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    const {
      author,
      title,
      extendedIngredients,
      description,
      analyzedInstructions,
      readyInMinutes,
      servings,
    } = req.body;
    const requiredFields = { title, readyInMinutes, servings };
    const imageName = uuidv4() + "-" + req.file.originalname;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: imageName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3.send(command);

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
    extendedIngredients.filter((ingredient) => ingredient.trim() !== "");
    if (extendedIngredients.length === 0) {
      return res.status(400).json("Add some ingredients");
    }
    analyzedInstructions.filter((instruction) => instruction.trim() !== "");
    if (analyzedInstructions.length === 0) {
      return res.status(400).json("Add some instructions");
    }

    const newId = uuidv4();
    const newRecipe = new Food({
      id: newId,
      title,
      extendedIngredients,
      analyzedInstructions,
      description,
      readyInMinutes,
      servings,
      imageName,
    });

    const user = await User.findOne({ username: author });

    try {
      await newRecipe.save();
      user.recipes.push({ title, newId, imageName });
      await user.save();
    } catch (e) {
      return res.json(e);
    }

    res.status(200).json("Successfully added your recipe");
  }
);

app.get("/get-community-recipes", async (req, res) => {
  const recipes = await Food.find().limit(10).lean();

  for (const recipe of recipes) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: recipe.imageName,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    recipe.image = url;
  }
  return res.status(200).json(recipes);
});
app.post("/search-community-recipes", async (req, res) => {
  const name = req.query.query;
  const recipes = await Food.find({ title: name }).limit(10).lean();

  for (const recipe of recipes) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: recipe.imageName,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    recipe.image = url;
  }
  return res.status(200).json(recipes);
});

app.post("/get-community-recipe", async (req, res) => {
  const { food } = req.body;
  const foodId = food.id;
  const recipeDocument = await Food.findOne({ id: foodId });
  if (!recipeDocument) {
    return res.status(500).json("Not Found");
  }

  const recipe = recipeDocument.toObject();
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: recipe.imageName,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  recipe.image = url;
  return res.status(200).json(recipe);
});

app.post("/get-user-information", async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res.status(400).json("No user like that");
  }

  const recipes = user.recipes;
  for (const recipe of recipes) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: recipe.imageName,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    recipe.url = url;
  }
  let userAvatar = "";
  if (user.imageName) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: user.imageName,
    });
    userAvatar = await getSignedUrl(s3, command, { expiresIn: 3600 });
  }

  const data = {
    recipes: recipes,
    username: user.username,
    image: userAvatar,
  };
  return res.status(200).json(data);
});

app.post("/upload-photo", upload.single("image"), async (req, res) => {
  const { username } = req.body;
  const imageName = uuidv4() + "-" + req.file.originalname;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  });

  try {
    await s3.send(command);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json("No user like that");
    }
    user.imageName = imageName;
    await user.save();
  } catch (e) {
    return res.status(400).json(e);
  }
  return res.status(200).json("Picture uploaded successfully");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
