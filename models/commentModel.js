const mongoose = require('mongoose')

const commentSchema = mongoose.Schema(
    {
        comment: {
            type: String,
            required: [true, 'Comment is empty']
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        likes: { 
            type: Array
        },
        reports: { 
            type: Array
        },
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