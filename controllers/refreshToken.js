const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = async (req, res) => {
  // Find JWT in cookies
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  console.log(cookies);
  // Find user with certain Refresh Token in DB
  const user = await User.findOne({
    where: { refresh_token: refreshToken },
  });

  if (!user) return res.status(403).json("No user with that refresh token!");

  // Validate JWT
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      console.log("LOGGING: ", decoded.username);
      if (err || user.username !== decoded.username) return res.sendStatus(403);

      const rolesRaw = await user.getRoles({
        attributes: ["roleName"],
        raw: true,
      });
      const roles = rolesRaw.map((role) => Object.values(role)[0]);
      console.log(roles);
      const accessToken = jwt.sign(
        {
          userInfo: {
            username: decoded.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      res.json({ accessToken });
    }
  );
};

module.exports = {
  handleRefreshToken,
};
