var express = require('express');
const { route } = require('.');
var router = express.Router();
const { protect } = require('../middleware/authMiddleware')
const { userRegister, userLogin, userUpdate, getMe, getUser, getAllUsers } = require('../controllers/userController')
const { sendFriendRequest, unfriend, unfriendById} = require('../controllers/friendRequestController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', userRegister)
router.post('/login', userLogin)
router.get('/profile', protect, getMe)
router.get('/all', protect, getAllUsers)
router.get('/:userId', protect, getUser)

router.post('/:userId/send-friend-request', protect, sendFriendRequest)
router.put('/:userId/unfriend', protect, unfriendById)

module.exports = router;
