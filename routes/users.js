var express = require("express")
const { route } = require(".")
var router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const {
  userRegister,
  userLogin,
  userUpdate,
  getMe,
  getUser,
  getAllUsers,
  uploadProfilePic,
} = require("../controllers/userController")
const {
  sendFriendRequest,
  unfriend,
  unfriendById,
} = require("../controllers/friendRequestController")

//setting options for multer
const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
})

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource")
})

router.post("/register", userRegister)
router.post("/login", userLogin)
router.get("/profile", protect, getMe)
router.get("/all", protect, getAllUsers)
router.get("/:userId", protect, getUser)
router.post("/upload", protect, upload.single("profile_pic"), uploadProfilePic)
router.put("/update", protect, userUpdate)

router.post("/:userId/send-friend-request", protect, sendFriendRequest)
router.put("/:userId/unfriend", protect, unfriendById)

module.exports = router
