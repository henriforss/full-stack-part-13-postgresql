const router = require("express").Router();
const Session = require("../models/session");
const tokenExtractor = require("../middleware/tokenExtractor");

router.delete("/", tokenExtractor, async (req, res, next) => {
  // Delete all user sessions from sessions table
  try {
    await Session.destroy({
      where: {
        userId: req.decodedToken.id,
      },
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
