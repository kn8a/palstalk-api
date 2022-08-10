const User = require('../models/userModel')
const Post = require('../models/postModel')
const asyncHandler = require('express-async-handler')

//! Create post
const createPost = asyncHandler( async (req,res) => {
    const { content, image } = req.body
    const newPost = await Post.create({
        content,
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
        res.status(400).json({ error: 'Blog post not found'})
    } 
    if (!req.user) {
        res.status(401).json({ error: 'Not authorized to edit'}) 
    }
    if (post.author.toString() !== req.user.id) {
        res.status(401).json({ error: 'Not authorized to edit'})
    } 
    
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, req.body, {
        new: true,
    })
    res.status(200).json(updatedPost)    
})

//! delete post
const deletePost = asyncHandler( async (req,res) => {
    
})

//! like post

const likePost = asyncHandler( async (req,res) => {
    const post = await Post.findById(req.params.postId)
    const alreadyLiked = await post.likes.findIndex(id => (id.toString() == req.user._id))
    if (alreadyLiked == -1) {
        await Post.findByIdAndUpdate(req.params.postId, {$push: {likes: req.user._id}})
        res.status(200).json({message:'liked'})
    } else {
        await Post.findByIdAndUpdate(req.params.postId, {$pull: {likes: req.user._id}})
        res.status(200).json({message:'unliked'})
    }

})


//! report post
const reportPost = asyncHandler( async (req,res) => {
    
})

//! Create post
const getPost = asyncHandler( async (req,res) => {
    
})

module.exports = {
    createPost, editPost, deletePost, likePost, reportPost, getPost
}