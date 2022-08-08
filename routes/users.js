var express = require('express');
const { route } = require('.');
var router = express.Router();
const { protect } = require('../middleware/authMiddleware')
const { userRegister, userLogin, userUpdate, getMe, getUser } = require('../controllers/userController')
const { sendFriendRequest, getReceived, getSent, getRequest, acceptFriendRequest, declineFriendRequest, cancelFriendRequest} = require('../controllers/friendRequestController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', userRegister)
router.post('/login', userLogin)
router.get('/profile', protect, getMe)
router.get('/:userId', protect, getUser)

router.post('/:userId/send-friend-request', protect, sendFriendRequest)

router.get('/requests/received', protect, getReceived)
router.get('/requests/sent', protect, getSent)
router.get('/requests/:requestId', protect, getRequest)

router.put('/requests/:requestId/accept', protect, acceptFriendRequest)
router.put('/requests/:requestId/decline', protect, declineFriendRequest)
router.put('/requests/:requestId/cancel', protect, cancelFriendRequest)

module.exports = router;
