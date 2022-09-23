const User = require("../models/user");
const jwt = require("jsonwebtoken");

const handleLogout = async (req, res) => {
  // ! On client side also delete the access_token !!
  // Find JWT in cookies
  const cookies = req.cookies;
  console.log("Logging out...");
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;
  // Find user with certain Refresh Token in DB
  const user = await User.findOne({
    where: { refresh_token: refreshToken },
  });
  if (!user) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(204);
  }
  // Delete refresh token from DB
  user
    .update({ refresh_token: null })
    .then(() => {
      res.clearCookie("jwt", { httpOnly: true });
      res.sendStatus(204);
    })
    .catch((err) => res.sendStatus(500));
};

module.exports = {
  handleLogout,
};
