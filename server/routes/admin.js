const express = require("express");
const router = express.Router();

const { recognizeFace, adminLogin, createUser, updateUser, deleteUser } = require("../controllers/admin");
//   getUser,
//   getUsers,
//   getSortedUsers,
//   getFilteredUsers,

router.route("/login").post(adminLogin);
router.route("/recognizeface").post(recognizeFace);
router.route("/users/create").post(createUser);
router.route("/users/:user_id?").patch(updateUser).delete(deleteUser);
// router.route("/dashboard").get(getUsers);
// router.route("/users/search").post(getFilteredUsers);
// router.route("/users/sort").get(getSortedUsers);


//   .get(getUser)

module.exports = router;