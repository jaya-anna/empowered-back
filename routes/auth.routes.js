const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

//some changes here if it doesnt work (Diana)
router.post("/signup", async (req, res, next) => {
  try {
    const { username , email } = req.body ;

    const salt = bcrypt.genSaltSync(13);
    const passwordHash = bcrypt.hashSync(req.body.password, salt);

    await User.create({
      username,
      email,
      passwordHash,
    });
    res.status(201).json({ errorMessage: "User created successfully" });
  } catch (error) {
    console.log("Error signing up: ", error);
    res.status(400).json({ errorMessage: "Error signing up" });
  }
});

// some changes here if it doesnt work (Diana)
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      if (bcrypt.compareSync(password, foundUser.passwordHash)) {
        const authToken = jwt.sign(
          {
            expiresIn: "6h",
            user: foundUser,
          },
          process.env.TOKEN_SECRET,
          {
            algorithm: "HS256",
          }
        );
        res.status(200).json({ token: authToken, foundUser });
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
// some changes here if it doesnt work (Diana)
router.put("/update", isAuthenticated, async (req, res, next) => {
  const { username, email } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.payload.user._id,
      { username, email },
      { new: true }
    );

    res
    .status(200)
    .json({ message: "Profile info successfully updated", updatedUser });

  } catch (error) {
    console.log("Error updating user information: ", error);

    res
    .status(500)
    .json({ errorMessage: "Error updating user information" });
}
});

// router Delete Profile

router.delete("/profile", isAuthenticated, async (req, res, next) => {
  try {

    await User.findByIdAndDelete(req.payload.user._id);
    res.json({ message: "Profile deleted" });

  } catch (error) {
    console.log("Error deleting profile: ", error);
    res.status(500).json({ errorMessage: "Error deleting profile" });
}
});

module.exports = router;
