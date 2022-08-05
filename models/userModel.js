const mongoose = require('mongoose')

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
    password: {
        type: String,
        required: [true, 'Please add a password'],    
    },
    profile_pic: {
        type: String,

    },
    friends: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    ], 
    posts: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
    ],   
    role: {
        type: String,
        required: true, 
        default: 'user',
        enum: ['user', 'admin'],
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('User', userSchema)