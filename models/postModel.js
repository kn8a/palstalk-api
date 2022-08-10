const mongoose = require('mongoose')

const postSchema = mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Post cannot be empty']
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
        is_edited: {type: Boolean, default: false, timestamps: true},
        is_reported: {type: Boolean, default: false, timestamps: true} //true if reports array is length of 10
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Post', postSchema)