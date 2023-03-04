const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/signup", async (req, res, next) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const salt = bcrypt.genSaltSync(13);
    const passwordHash = bcrypt.hashSync(req.body.password, salt);

    await User.create({
      username: username,
      email: email,
      passwordHash: passwordHash,
    });
    res.status(201).json({ errorMessage: "User created successfully" });
  } catch (error) {
    console.log("Error signing up: ", error);
    res.status(400).json({ errorMessage: "Error signing up" });
  }
});

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
        res.status(403).json({errorMessage:"Password incorrect"});
      }
    } else {
      res.status(404).json({errorMessage:"User not found"});
    }
  } catch (error) {
    console.log("Error finding user: ", error);
  }
});

router.post("/verify", isAuthenticated, (req, res, next) => {
  if (req.payload) {
    console.log("PAYLOAD: ", req.payload);
    res.json(req.payload.user);
  }
});

// router Update Profile
router.put("/update", async (req, res, next) => {
  console.log(req.body);
  const updatedUsername = req.body.username;
  const updatedEmail = req.body.email;

  try {
    await User.findOneAndUpdate(
      { id: req.params._id },
      { username: updatedUsername, email: updatedEmail }
    );
    res.status(200).json({ message: "Profile info sucessfully updated" });
  } catch (error) {
    console.log("Error updating user information: ", error);
    res.status(500).json({ errorMessage: "Error updating user information" });
}
});

// router Delete Profile

router.delete("/profile", async (req, res, next) => {
  try {

    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Profile deleted" });

    res.status(200).json({ message: "Profile sucessfully deleted" });
  } catch (error) {
    console.log("Error deleting profile: ", error);
    res.status(500).json({ errorMessage: "Error deleting profile" });
}
});

module.exports = router;
