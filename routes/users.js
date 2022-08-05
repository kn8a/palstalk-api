var express = require('express');
const { route } = require('.');
var router = express.Router();
const { protect } = require('../middleware/authMiddleware')
const {userRegister, userLogin, userUpdate, getMe, getUser} = require('../controllers/userController')
const { sendFriendRequest, getReceived, getSent, getRequest, acceptFriendRequest, declineFriendRequest, deleteFriendRequest} = require('../controllers/friendRequestController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', userRegister)
router.post('/login', userLogin)
router.get('/me', protect, getMe)
router.get('/:userId', protect, getUser)

router.post('/:userId/send-friend-request', protect, sendFriendRequest)

router.get('/me/requests/received', protect, getReceived)
router.get('/:userId/requests/sent', protect, getSent)
router.get('/:userId/requests/:requestId', protect, getRequest)

router.put('/:userId/requests/:requestId/accept', protect, acceptFriendRequest)
router.put('/:userId/requests/:requestId/decline', protect, declineFriendRequest)


module.exports = router;
