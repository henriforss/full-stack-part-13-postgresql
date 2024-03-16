const router = require("express").Router();

const { Blog } = require("../models"); // This will pick up index.js by default

// Get all
router.get("/", async (req, res) => {
  const notes = await Blog.findAll();
  res.json(notes);
});

// Create new
router.post("/", async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch (error) {
    next(error); // Centralized error handling
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
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
