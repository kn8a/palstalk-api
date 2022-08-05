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
        likes: { type: Array },
        comments: { type: Array },
        reports: { type: Array }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Post', postSchema)