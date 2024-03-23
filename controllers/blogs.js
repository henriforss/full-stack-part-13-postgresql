const router = require("express").Router();
const { Blog, User } = require("../models"); // This will pick up index.js by default
const tokenExtractor = require("../middleware/tokenExtractor");
const { Op } = require("sequelize");

// Get all
router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: "%" + req.query.search + "%",
        },
      },
      {
        author: {
          [Op.iLike]: "%" + req.query.search + "%",
        },
      },
    ];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name", "username"],
    },
    where,
  });
  res.json(blogs);
});

// Create new
router.post("/", tokenExtractor, async (req, res, next) => {
  console.log(req.body);

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

// Get authors and sort by number of blogs
router.get("/api/authors", async (req, res) => {
  const authors = await User.findAll({
    attributes: [
      "name",
      [Sequelize.fn("COUNT", Sequelize.col("Blogs.id")), "articles"],
      [Sequelize.fn("SUM", Sequelize.col("Blogs.likes")), "likes"],
    ],
    include: {
      model: Blog,
      attributes: [],
    },
    group: ["User.id"],
    order: [[Sequelize.literal("likes"), "DESC"]],
  });

  const formattedAuthors = authors.map((author) => ({
    author: author.name,
    articles: author.getDataValue("articles"),
    likes: author.getDataValue("likes") || 0,
  }));

  res.json(formattedAuthors);
});
