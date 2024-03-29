const router = require("express").Router();

const tokenExtractor = require("../middleware/tokenExtractor");
const { ReadingLists, User } = require("../models"); // This will pick up index.js by default

// Add blog to reading list
router.post("/", async (req, res, next) => {
  try {
    const listItem = await ReadingLists.create(req.body);
    return res.json(listItem);
  } catch (error) {
    next(error); // Centralized error handling
  }
});

// Change read status
router.put("/:id", tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.decodedToken.id } });
    const listItem = await ReadingLists.findByPk(req.params.id);
    if (listItem && listItem.userId === user.id) {
      listItem.read = req.body.read;
      await listItem.save();
      res.json(listItem);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error); // Centralized error handling
  }
});

module.exports = router;
