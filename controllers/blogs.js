const router = require("express").Router();

const { Blog, User } = require("../models"); // This will pick up index.js by default

const tokenExtractor = require("../middleware/tokenExtractor");

// Get all
router.get("/", async (req, res) => {
  const notes = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
  });
  res.json(notes);
});

// Create new
router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.decodedToken.id } });
    const blog = await Blog.create({ ...req.body, userId: user.id });
    return res.json(blog);
  } catch (error) {
    next(error); // Centralized error handling
  }
});

// Delete
router.delete("/:id", tokenExtractor, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog && blog.userId === req.decodedToken.id) {
    await blog.destroy();
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

// Update likes
router.put("/:id", async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    try {
      blog.likes = req.body.likes;
      await blog.save();
      res.json(blog);
    } catch (error) {
      next(error); // Centralized error handling
    }
  } else {
    res.status(404).end();
  }
});

module.exports = router;
