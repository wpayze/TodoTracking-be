var express = require('express');
var router = express.Router();

const auth = require("../middleware/auth");

var userController = require("../controllers/userController");

router.get("/user/me", auth, userController.getUserByToken);
router.post("/user/logout", auth, userController.logout);
router.post("/user/logoutall", auth, userController.logoutAll);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;