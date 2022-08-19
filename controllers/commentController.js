const Comment = require('../models/commentModel')
const Post = require('../models/postModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

//^ get all comments for post - viewer/admin
const getCommentsForPost = asyncHandler( async (req,res) => {
    const post = await Post.findById(req.params.postId)
    .populate({path: "comments",
    populate: { path: "author", select:{name_first: 1, name_last:1, profile_pic:1}
    }
  })
  .sort("createdAt")

  const authorIsFriend = req.user.friends.indexOf(post.author._id)
    if (authorIsFriend != -1 || post.author._id.toString() == req.user._id.toString()) {
        const comments = post.comments
        res.status(200).json(comments)
        
        return
    }
    res.status(401).json({message: 'You are not authorized to access this resource'})
})

//^ get a single comment
const getComment = asyncHandler( async (req,res) => {
    const comment = await Comment.findById(req.params.commentId)
    .populate({path: 'postId', select:{author: 1}})

    const post = comment.postId


    const authorIsFriend = req.user.friends.indexOf(post.author._id)
    if (authorIsFriend != -1 || post.author._id.toString() == req.user._id.toString()) {
        
        res.status(200).json(comment)
        
        return
    }
    res.status(401).json({message: 'You are not authorized to access this resource'})
})




//^ create a single comment to blog-post
const createComment = asyncHandler( async (req,res) => {
    const comment = await Comment.create({
        comment: req.body.comment,
        author: req.user._id,
        postId: req.params.postId
    })
    await Post.findByIdAndUpdate({_id: req.params.postId}, {$push: {comments: comment._id}})
    res.status(200).json(comment)
})

//^ comment edit - add "isEdited" field to model - only author
const editComment = asyncHandler( async (req,res) => {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
        res.status(400).json({ error: 'Comment not found'})
    } 
    if (!req.user) {
        res.status(401).json({ error: 'Not authorized to edit'}) 
    }
    if (comment.author.toString() !== req.user._id) {
        res.status(401).json({ error: 'Not authorized to edit'})
    } 
    req.body.isEdited = true
    const updatedComment = await Comment.findByIdAndUpdate(req.params.postId, req.body, {
        new: true,
    })
    res.status(200).json(updatedComment)  
})

//^ delete a comment 
const deleteComment = asyncHandler( async (req,res) => {
    
})

//^ comment like
const likeComment = asyncHandler( async (req,res) => {
    const comment = await Comment.findById(req.params.commentId)
    const alreadyLiked = await comment.likes.findIndex(id => (id.toString() == req.user._id))
    if (alreadyLiked == -1) {
        await Comment.findByIdAndUpdate(req.params.commentId, {$push: {likes: req.user._id}})
        res.status(200).json({message:'Comment liked'})
    } else {
        res.status(200).json({message:'You already liked this comment'})
    }
})

//^ comment unlike
const unlikeComment = asyncHandler( async (req,res) => {
    const comment = await Comment.findById(req.params.commentId)
    const alreadyLiked = await comment.likes.findIndex(id => (id.toString() == req.user._id))
    if (alreadyLiked == -1) { //if not already liked
        res.status(200).json({message:`You haven't liked this comment`})
    } else {
        await Comment.findByIdAndUpdate(req.params.commentId, {$pull: {likes: req.user._id}})
        res.status(200).json({message:'Unliked comment'})
    }
})

//^ report comment
const reportComment = asyncHandler( async (req,res) => {
    const comment = await Comment.findById(req.params.commentId)
    const alreadyReported = await comment.reports.findIndex(id => (id.toString() == req.user._id))
    if (alreadyReported == -1) {
        await Comment.findByIdAndUpdate(req.params.commentId, {$push: {reports: req.user._id}})
        if (comment.reports.length = 9) { 
            await Comment.findByIdAndUpdate(req.params.commentId, {is_reported: true})
        }
        res.status(200).json({message:'Comment reported'})
    } else {
        res.status(200).json({message:'You already reported this comment'})
    }
})


module.exports = {
    getCommentsForPost, getComment, createComment, editComment, likeComment, unlikeComment, reportComment, deleteComment
}