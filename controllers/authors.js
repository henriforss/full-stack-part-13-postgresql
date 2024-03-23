const router = require("express").Router();
const { Blog } = require("../models"); // This will pick up index.js by default
const Sequelize = require("sequelize");

// Get authors and sort by number of blogs
router.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      "author",
      [Sequelize.fn("COUNT", Sequelize.col("id")), "blogs"],
      [Sequelize.fn("SUM", Sequelize.col("likes")), "likes"],
    ],
    group: ["author"],
    order: [[Sequelize.literal("likes"), "DESC"]],
  });

  const formattedAuthors = authors.map((author) => ({
    author: author.getDataValue("author"),
    articles: author.getDataValue("blogs"),
    likes: author.getDataValue("likes") || 0,
  }));

  res.json(formattedAuthors);
});

module.exports = router;
