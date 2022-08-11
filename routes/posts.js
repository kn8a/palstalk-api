var express = require('express');
const { route } = require('.');
const { protect } = require('../middleware/authMiddleware');
var router = express.Router();
const {createPost, getPost, editPost, deletePost, likePost, reportPost, unlikePost} = require('../controllers/postController')
const {getCommentsForPost, createComment, editComment, likeComment, unlikeComment, reportComment, deleteComment} = require('../controllers/commentController')

router.post('/', protect, createPost)
router.put('/:postId', protect, editPost)
router.put('/:postId/like', protect, likePost)
router.put('/:postId/unlike', protect, unlikePost)
router.put('/:postId/report', protect, reportPost)


router.get('/:postId/comments', protect, getCommentsForPost)
router.post('/:postId/comments', protect, createComment) 
router.put('/:postId/:commentId', protect, editComment) 
router.put('/:postId/:commentId/like', protect, likeComment) 
router.put('/:postId/:commentId/unlike', protect, unlikeComment) 
router.put('/:postId/:commentId/report', protect, reportComment)

router.delete('/:postId/:commentId/delete', protect, deleteComment)

module.exports = router;