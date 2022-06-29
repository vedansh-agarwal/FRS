const express = require("express");
const router = express.Router();

const {
  adminLogin,
  createUser,
//   getUser,
//   getUsers,
//   getSortedUsers,
//   getFilteredUsers,
  updateUser,
//   deleteUser,
  checkFace,
} = require("../controllers/admin");

router.route("/login").post(adminLogin);
router.route("/users/create").post(createUser);
// router.route("/dashboard").get(getUsers);
// router.route("/users/search").post(getFilteredUsers);
// router.route("/users/sort").get(getSortedUsers);
router.route("/checkFace").post(checkFace);
router.route("/users/:user_id?").patch(updateUser)
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

module.exports = router;