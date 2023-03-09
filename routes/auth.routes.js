const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

//route for signup
router.post("/signup", async (req, res, next) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const salt = bcrypt.genSaltSync(13);
    const passwordHash = bcrypt.hashSync(req.body.password, salt);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (email === "" || passwordHash === "" || username === "") {
      res
        .status(400)
        .json({ errorMessage: "Provide email, password and name" });
      return;
    }

    if (!emailRegex.test(email)) {
      res.status(400).json({ errorMessage: "Provide a valid email address" });
      return;
    }

    if (req.body.password.length < 6) {
      res
        .status(400)
        .json({ errorMessage: "Password must have at least 6 characters" });
      return;
    }

    await User.create({
      username: username,
      email: email,
      passwordHash: passwordHash,
    });
    res.status(201).json({ errorMessage: "User created successfully" });
  } catch (error) {
    console.log("Error signing up: ", error);
  }
});

// route for login
router.post("/login", async (req, res, next) => {
  const username = req.body.username;

  try {
    const foundUser = await User.find({ username: username });

    if (foundUser.length) {
      if (bcrypt.compareSync(req.body.password, foundUser[0].passwordHash)) {
        const authToken = jwt.sign(
          {
            expiresIn: "6h",
            user: foundUser[0],
          },
          process.env.TOKEN_SECRET,
          {
            algorithm: "HS256",
          }
        );
        res.status(200).json({ token: authToken, foundUser: foundUser[0] });
      } else {
        res.status(403).json({ errorMessage: "Password incorrect" });
      }
    } else {
      res.status(404).json({ errorMessage: "User not found" });
    }
  } catch (error) {
    console.log("Error finding user: ", error);
  }
});

// route for verification
router.post("/verify", isAuthenticated, (req, res, next) => {
  if (req.payload) {
    console.log("PAYLOAD: ", req.payload);
    res.json(req.payload.user);
  }
});

// route for Updating Profile
router.put("/update/:userId", isAuthenticated, async (req, res) => {
  try {
    const updatedUsername = req.body.username;
    const updatedEmail = req.body.email;

    const value = await User.findByIdAndUpdate(
        req.payload.user._id ,
      { username: updatedUsername, email: updatedEmail }, { new: true }
    );
    console.log(value);

    const updatedUser = await User.findById(req.payload.user._id);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error updating user information: ", error);
    res.status(500).json({ errorMessage: "Error updating user information" });
  }
});

// route for deleting Profile
router.delete("/profile/:userId", async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ errorMessage: "Profile sucessfully deleted" });
  } catch (error) {
    console.log("Error deleting profile: ", error);
    res.status(500).json({ errorMessage: "Error deleting profile" });
  }
});

module.exports = router;