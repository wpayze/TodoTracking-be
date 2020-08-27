var express = require('express')
var router = express.Router()

const auth = require("../middleware/auth")

var userController = require("../controllers/userController")
var parcelController = require("../controllers/parcelController")

var seeder = require("../seeder/user")

//USER ROUTES
router.get("/user/me", auth, userController.getUserByToken);
router.get("/users", auth, userController.getAllUsers);

router.put("/user", auth, userController.updateInfo);

router.post("/user/logout", auth, userController.logout);
router.post("/user/logoutall", auth, userController.logoutAll);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// PARCEL ROUTES
router.get("/parcel/:id", auth, parcelController.getParcel);
router.get("/parcels", auth, parcelController.getParcels);
router.put("/parcel", auth, parcelController.editParcel);
router.post("/parcel", auth, parcelController.addParcel);

router.get("/seeder/user", seeder.userSeeder);

module.exports = router;