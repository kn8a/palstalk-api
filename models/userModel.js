const mongoose = require('mongoose')
const { stringify } = require('uuid')

const userSchema = mongoose.Schema({
    name_first: {
        type: String,
        required: [true, 'Please add a name'],    
    },
    name_last: {
        type: String,
        required: [true, 'Please add a last name'],    
    },
    gender: { 
        type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        required: [true, 'Please select your gender'], 
    },
    email: {
        type: String,
        required: [true, 'Please add a display name'],  
        unique: true  
    },
    bio: {
        type: String
    },
    location: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],    
    },
    profile_pic: {
        type: String, default: '/api/file/630dc2552f6866ee7ec33221'
    },
    friends: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    pending_requests: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'FriendRequest'}
    ],
    posts: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
    ],   
    role: {
        type: String,
        required: true, 
        default: 'user',
        enum: ['user', 'admin', 'dev'],
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('User', userSchema)