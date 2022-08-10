var express = require('express');
const { route } = require('.');
const { protect } = require('../middleware/authMiddleware');
var router = express.Router();
const {createPost, getPost, editPost, deletePost, likePost, reportPost} = require('../controllers/postController')

router.post('/', protect, createPost)
router.put('/:postId', protect, editPost)
router.put('/:postId/like', protect, likePost)


module.exports = router;