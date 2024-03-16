// Error handler
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "SequelizeValidationError") {
    return res.status(400).send({ error: "Sequalize validation error" });
  }

  if (err.name === "SequelizeDatabaseError") {
    return res.status(400).send({ error: "Sequalize database error" });
  }

  next(err);
};

module.exports = errorHandler;
