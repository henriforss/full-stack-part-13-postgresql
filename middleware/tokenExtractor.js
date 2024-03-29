const { SECRET } = require("../util/config");
const jwt = require("jsonwebtoken");
const Session = require("../models/session");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      // Check if the token is in the sessions table
      const session = await Session.findOne({
        where: {
          token: authorization.substring(7),
        },
      });

      if (session) {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
      } else {
        return res.status(401).json({ error: "session invalid" });
      }
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

module.exports = tokenExtractor;
