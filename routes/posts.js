var express = require('express');
const { route } = require('.');
const { protect } = require('../middleware/authMiddleware');
var router = express.Router();
const {createPost, getPost, getBoard, editPost, deletePost, getMyPosts, likePost, reportPost, unlikePost} = require('../controllers/postController')
const {getCommentsForPost, getComment, createComment, editComment, likeComment, unlikeComment, reportComment, deleteComment} = require('../controllers/commentController')

router.post('/', protect, createPost)
router.put('/:postId', protect, editPost)
router.put('/:postId/like', protect, likePost)
router.put('/:postId/unlike', protect, unlikePost)
router.put('/:postId/report', protect, reportPost)

router.get('/my_posts', protect, getMyPosts) //recent posts from user

router.get('/:postId/comments', protect, getCommentsForPost)
router.post('/:postId/comments', protect, createComment) 
router.put('/:postId/:commentId', protect, editComment) 
router.get('/:postId/:commentId', protect, getComment)
router.put('/:postId/:commentId/like', protect, likeComment) 
router.put('/:postId/:commentId/unlike', protect, unlikeComment) 
router.put('/:postId/:commentId/report', protect, reportComment)
router.delete('/:postId', protect, deletePost)

router.delete('/:postId/:commentId/delete', protect, deleteComment)


router.get('/board', protect, getBoard) //recent posts from user and friends
router.get('/:postId', protect, getPost)




module.exports = router;