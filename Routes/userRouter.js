const router = require("express").Router();
const {
  register,
  login,
  updateUser,
  getData,
} = require("../Controller/userController");
const verifyToken = require("../Middleware/verifyToken");

router.post("/register", register);
router.post("/login", login);
router.put("/update/:id", verifyToken, updateUser);

router.get("/getAll", getData);

module.exports = router;
