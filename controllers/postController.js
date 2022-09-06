const User = require('../models/userModel')
const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
const asyncHandler = require('express-async-handler')
const sanitizeHtml = require('sanitize-html');

//! Create post
const createPost = asyncHandler( async (req,res) => {
    const { content, image } = req.body
    const newPost = await Post.create({
        content: sanitizeHtml(content),
        image,
        author: req.user._id
    })

    //update user posts array
    const updateAuthor = await User.findByIdAndUpdate(req.user._id, {$push: {posts: newPost._id}})
    res.status(200).json(newPost)
})

//! Edit post
const editPost = asyncHandler( async (req,res) => {
    const post = await Post.findById(req.params.postId)
    if (!post) {
        res.status(400).json({ error: 'Post not found'})
    } 
    if (!req.user) {
        res.status(401).json({ error: 'Not authorized to edit'}) 
    }
    if (post.author.toString() !== req.user._id) {
        res.status(401).json({ error: 'Not authorized to edit'})
    } 
    req.body.isEdited = true
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, req.body, {
        new: true,
    })
    res.status(200).json(updatedPost)    
})

//! delete post
const deletePost = asyncHandler( async (req,res) => {
    const userId = req.user._id
    const post = await Post.findById(req.params.postId)
    if (post.author.toString() != userId.toString()) {
        res.status(400).json({message: 'Not authorized to access this resource'})
        return
    } else {
        await Comment.deleteMany({postId: post._id})
        await User.findByIdAndUpdate(userId, {$pull: {posts:post._id}})
        await Post.findByIdAndDelete(post._id)
        res.status(200).json({message: 'deleted', deletedPostId: post._id})
    }
})

//! like post

const likePost = asyncHandler( async (req,res) => {

    const post = await Post.findById(req.params.postId)
    const alreadyLiked = await post.likes.findIndex(id => (id.toString() == req.user._id))
    if (alreadyLiked == -1) {
        await Post.findByIdAndUpdate(req.params.postId, {$push: {likes: req.user._id}})
        res.status(200).json({message:'liked'})
    } else {
        res.status(200).json({message:'You already liked this post'})
    }
})

const unlikePost = asyncHandler( async (req,res) => {
    const post = await Post.findById(req.params.postId)
    const alreadyLiked = await post.likes.findIndex(id => (id.toString() == req.user._id))
    if (alreadyLiked == -1) { //if not already liked
        res.status(200).json({message:`You haven't liked this post`})
    } else {
        await Post.findByIdAndUpdate(req.params.postId, {$pull: {likes: req.user._id}})
        res.status(200).json({message:'unliked'})
    }
})


//! report post
const reportPost = asyncHandler( async (req,res) => {
    const post = await Post.findById(req.params.postId)
    const alreadyReported = await post.reports.findIndex(id => (id.toString() == req.user._id))
    if (alreadyReported == -1) {
        await Post.findByIdAndUpdate(req.params.postId, {$push: {reports: req.user._id}})
        if (post.reports.length = 9) { 
            await Post.findByIdAndUpdate(req.params.postId, {is_reported: true})
        }
        res.status(200).json({message:'Post reported'})
    } else {
        res.status(200).json({message:'You already reported this post'})
    }
})

//! Get post
const getPost = asyncHandler( async (req,res) => {
    const post = await Post.findById(req.params.postId).populate("comments")
    .populate({path: 'author', select:{name_first: 1, name_last:1, profile_pic:1} })
    .populate({path: "comments", populate: { path: "author", select:{name_first: 1, name_last:1, profile_pic:1}}
    })
    console.log(req.user.friends, post.author._id, req.user._id)
    const authorIsFriend = req.user.friends.indexOf(post.author._id)

    if (authorIsFriend != -1 || post.author._id.toString() == req.user._id.toString()) {
        res.status(200).json(post)
        
        return
    }
    res.status(401).json({message: 'You are not authorized to access this resource'})
})

//! Get post
const getBoard = asyncHandler( async (req,res) => {
    let meAndFriends = req.user.friends
    meAndFriends.push(req.user._id)
    const boardPosts = await Post.find({"author":  { $in: meAndFriends}, "is_reported": false})
    .populate("comments")
    .populate({path: 'author', select:{name_first: 1, name_last:1, profile_pic:1} })
    .populate({path: "comments",
      populate: { path: "author", select:{name_first: 1, name_last:1, profile_pic:1}
      }
    })
    .sort("-createdAt")
    res.status(200).json(boardPosts)

    // const postsFromUser = await User.findById(req.user._id)
    //     .populate({path: 'posts', populate: {path}})
})

//! Get my posts
const getMyPosts = asyncHandler( async (req,res) => {
    //console.log(req.user)
    const myPosts = await Post.find({_id:{$in:req.user.posts}})
    .populate("comments")
    .populate({path: 'author', select:{name_first: 1, name_last:1, profile_pic:1} })
    .populate({path: "comments", populate: { path: "author", select:{name_first: 1, name_last:1, profile_pic:1}}
    })
    .sort("-createdAt")
    console.log(myPosts)
    res.status(200).json(myPosts)
})


const updatePost = asyncHandler( async (req,res) => {
    const post = await Post.findById(req.params.postId)
    if (post.author.toString() != req.user._id.toString()) {
        res.status(400).json({message: 'You are not authorized to access this resource'})
        return
    } else {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {content: sanitizeHtml(req.body.content)}, {
            new: true,
        })
        res.status(200).json(updatedPost)

    }

})

    
module.exports = {
    createPost, editPost, deletePost, likePost, reportPost, getPost, unlikePost, getBoard, getMyPosts, updatePost
}