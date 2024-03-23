const router = require("express").Router();

const { User, Blog } = require("../models"); // This will pick up index.js by default

// Get all
router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: { model: Blog, attributes: { exclude: ["userId"] } },
  });
  res.json(users);
});

// Create new
router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    return res.json(user);
  } catch (error) {
    next(error); // Centralized error handling
  }
});

// Change username
router.put("/:username", async (req, res, next) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (user) {
    try {
      user.username = req.body.username;
      await user.save();
      res.json(user);
    } catch (error) {
      next(error); // Centralized error handling
    }
  } else {
    res.status(404).end();
  }
});

module.exports = router;
