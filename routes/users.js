var express = require('express');
const { route } = require('.');
var router = express.Router();
const { protect } = require('../middleware/authMiddleware')
const { userRegister, userLogin, userUpdate, getMe, getUser } = require('../controllers/userController')
const { sendFriendRequest, unfriend} = require('../controllers/friendRequestController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', userRegister)
router.post('/login', userLogin)
router.get('/profile', protect, getMe)
router.get('/:userId', protect, getUser)

router.post('/:userId/send-friend-request', protect, sendFriendRequest)
router.post('/:userId/unfriend', protect, unfriend)

module.exports = router;
