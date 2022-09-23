const router = require("express").Router();
const controller = require("../controllers/employees");
const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");

router.get("/", verifyRoles(ROLES_LIST.Admin), controller.getAll);

module.exports = router;
