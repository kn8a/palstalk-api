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
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Post', postSchema)