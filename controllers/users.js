const router = require("express").Router();

const { User, Blog, ReadingLists } = require("../models"); // This will pick up index.js by default

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

// Get single user
router.get("/:id", async (req, res) => {
  const where = {};

  if (req.query.read) {
    console.log(req.query.read);

    where.read = req.query.read === "true";
  }

  console.log(where);

  const user = await User.findByPk(req.params.id, {
    include: [
      { model: Blog, attributes: { exclude: ["userId"] } },
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
        through: {
          attributes: ["id", "read"],
          where,
        },
      },
    ],
  });
  res.json(user);
});

module.exports = router;
