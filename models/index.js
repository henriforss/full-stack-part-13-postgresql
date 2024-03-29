const Blog = require("./blog");
const User = require("./user");
const ReadingLists = require("./reading_lists");
const Session = require("./session");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingLists, as: "readings" });
Blog.belongsToMany(User, { through: ReadingLists, as: "readings" });

Session.belongsTo(User);
User.hasMany(Session);

module.exports = {
  Blog,
  User,
  ReadingLists,
  Session,
};
