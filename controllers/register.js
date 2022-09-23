const User = require("../models/user");
const bcrypt = require("bcrypt");
const { registerValidation } = require("../util/validation");

const register = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  // Check if user already exists
  const userExists = await User.findOne({
    where: { username: user },
  });
  if (userExists)
    return res.status(409).send("User with that name already exists!");

  // Hash the password
  const hashedPassword = await bcrypt.hash(req.body.pwd, 10);

  // Create user
  User.create({
    username: user,
    password: hashedPassword,
  })
    .then(async (user) => {
      const role = await user.createRole({ roleName: "User" });
      return user.addRole(role);
    })
    .then(() => {
      res.status(200).send("User created successfully!");
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = { register };
