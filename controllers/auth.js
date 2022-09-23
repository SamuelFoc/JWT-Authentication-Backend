const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Role = require("../models/role");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  // Handle input validation
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  // Find user in DB
  const foundUser = await User.findOne({
    where: { username: user },
  });
  if (!foundUser) return res.status(400).send("No user with that name!");
  console.log(foundUser);

  // Validate the password
  const validPass = await bcrypt.compare(pwd, foundUser.password);
  if (!validPass) return res.status(401).send("Invalid password!");

  // Get user roles
  const rolesRaw = await foundUser.getRoles({
    attributes: ["roleName"],
    raw: true,
  });
  const roles = rolesRaw.map((role) => Object.values(role)[0]);
  console.log(roles);

  // Create and assign the JWT .. production expires should be about 5mins
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30s",
    }
  );

  const refresh_token = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  foundUser.update({ refresh_token: refresh_token });

  res.cookie("jwt", refresh_token, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken, roles });
};

module.exports = {
  login,
};
