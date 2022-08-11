var express = require('express');
const { route } = require('.');
const { protect } = require('../middleware/authMiddleware');
var router = express.Router();
const {createPost, getPost, editPost, deletePost, likePost, reportPost, unlikePost} = require('../controllers/postController')

router.post('/', protect, createPost)
router.put('/:postId', protect, editPost)
router.put('/:postId/like', protect, likePost)
router.put('/:postId/unlike', protect, unlikePost)
router.put('/:postId/report', protect, reportPost)




module.exports = router;