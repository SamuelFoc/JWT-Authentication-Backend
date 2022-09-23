const User = require("../models/user");

const getAll = async (req, res) => {
  User.findAll()
    .then(async (users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = {
  getAll,
};
