var express = require("express")
const { route } = require(".")
var router = express.Router()
const { protect } = require("../middleware/authMiddleware")

const {
	getReceived,
	getSent,
	getRequest,
	acceptFriendRequest,
	declineFriendRequest,
	cancelFriendRequest,
	unfriend,
} = require("../controllers/friendRequestController")

router.get("/received", protect, getReceived)
router.get("/sent", protect, getSent)
router.get("/:requestId", protect, getRequest)

router.put("/:requestId/accept", protect, acceptFriendRequest)
router.put("/:requestId/decline", protect, declineFriendRequest)
router.put("/:requestId/cancel", protect, cancelFriendRequest)

router.put("/:requestId/unfriend", protect, unfriend)

module.exports = router
