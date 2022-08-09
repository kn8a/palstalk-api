const mongoose = require('mongoose')

const commentSchema = mongoose.Schema(
    {
        comment: {
            type: String,
            required: [true, 'Comment cannot be empty empty']
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        likes: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ],   
        reports: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ],   
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Comment', commentSchema)