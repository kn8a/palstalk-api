const mongoose = require('mongoose')

const postSchema = mongoose.Schema(
    {
        content: {
            type: String
        },
        image: {
            type: String
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        likes: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ],   
        comments: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
        ],   
        reports: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ], 
        status: {
            type: String,
            required: true, 
            default: 'active',
            enum: ['active', 'reported']
        }, 
        is_edited: {type: Boolean, default: false, timestamps: true}
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Post', postSchema)