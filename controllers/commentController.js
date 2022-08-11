const Comment = require('../models/commentModel')
const Post = require('../models/postModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

//^ get all comments for post - viewer/admin
const getCommentsForPost = asyncHandler( async (req,res) => {
    
})

//^ create a single comment to blog-post
const createComment = asyncHandler( async (req,res) => {
    
})

//^ comment edit - add "isEdited" field to model - only author
const editComment = asyncHandler( async (req,res) => {
    
})

//^ delete a comment 
const deleteComment = asyncHandler( async (req,res) => {
    
})

//^ comment like
const likeComment = asyncHandler( async (req,res) => {
    
})

//^ comment unlike
const unlikeComment = asyncHandler( async (req,res) => {
    
})

//^ report comment
const reportComment = asyncHandler( async (req,res) => {
    
})


module.exports = {
    getCommentsForPost, createComment, editComment, likeComment, unlikeComment, reportComment, deleteComment
}