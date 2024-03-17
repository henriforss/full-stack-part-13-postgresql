// Error handler
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "SequelizeValidationError") {
    return res.status(400).send({ error: err.errors[0].message });
  }

  if (err.name === "SequelizeDatabaseError") {
    return res.status(400).send({ error: "Sequalize database error" });
  }

  next(err);
};

module.exports = errorHandler;
