const addAdmin = (req, res) => {
  const username = req.body.user;
  User.findOne({
    where: { username: username },
  })
    .then(async (user) => {
      const role = await user.createRole({ roleName: "Admin" });
      return user.addRole(role);
    })
    .then((data) => res.status(200).send(`User ${username} added as an Admin!`))
    .catch((err) => res.status(500).send(err.message));
};

const getAll = async (req, res) => {
  User.findAll()
    .then(async (users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};
