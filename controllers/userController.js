const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var createError = require('http-errors');
const { populate } = require('../models/userModel');
const FriendRequest = require('../models/friendRequestModel')
const multer = require('multer')
//setting options for multer
const storage = multer.memoryStorage();

const Upload = require('../models/uploadModel')
const uuid = require('uuid')

//jwt token generator
const genToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

const uploadProfilePic = asyncHandler( async (req,res) =>{
    
    const PreviousPic = req.user.profile_pic //to be removed after update
    //console.log(PreviousPic)
    const newFile = {
        fileName: uuid.v4(),
        file: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
        },        
        user: req.user._id
    }
    //console.log(newFile)
    const uploaded = await Upload.create(newFile)
    
    const updateUserPic = await User.findByIdAndUpdate(req.user._id, {profile_pic: `${uploaded._id.toString()}`})
    if (PreviousPic != '630dc2552f6866ee7ec33221') {
        await Upload.findByIdAndDelete(PreviousPic)
    }
    //console.log(updateUserPic)
    res.status(200).json({message:'profile pic updated', fileId:uploaded._id.toString()})
})

//* User Registration
const userRegister = asyncHandler( async (req,res) => {
    console.log(req.body)
    const {name_first, name_last, email, password, confirm_password, gender} = req.body

    if (!name_first || !name_last || !email || !password || !confirm_password ||!gender) {
        res.status(400).json({message: 'Please fill out all required fields'})
        return
    }

    if (password != confirm_password) {
        res.status(400).json({message: `Passwords don't match. Please retry.`})
        return
    }

    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400).json({message: `User with this email already exists`})
        return
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password,salt)

    const newUser = User.create({
        name_first,
        name_last,
        email,
        password: hashedPass,
        gender,
        profile_pic: `630dc2552f6866ee7ec33221`
    })

    if (newUser) {
        res.status(200).json({message: 'Profile created successfully'})
    }
})


//*User login
const userLogin = asyncHandler( async (req,res) => {
    
    const {email, password} = req.body

    if (!email || !password) {
        res.status(400).json({message: 'Please fill enter email and password'})
        return
    }

    const user = await User.findOne({email})

    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        res.json({
            id: user.id,
            name_first: user.name_first,
            name_last: user.name_last,
            token: genToken(user.id),
            profile_pic: user.profile_pic
        })
        return
    } else {
        res.status(400).json({message: 'Invalid credential'})
    }

})

const getMe = asyncHandler( async (req,res) => {
    console.log(req.user._id)
    const user = await User.findById(req.user._id)
    .populate({path: 'friends', select:{name_first: 1, name_last:1, profile_pic:1}})
    .populate('posts')
    .select({password:0})
    res.status(200).json(user)
})

const getAllUsers = asyncHandler( async (req,res) => {
    const myRequests = req.user.pending_requests
    
    //get users which have a friend request with me
    const pendingUsers = await User.find({_id:{$ne:[req.user._id]},pending_requests: {$elemMatch: {$in:[...myRequests]}}}).select({name_first:1, name_last:1, profile_pic:1})
    //get users which are not my friends and dont have a pending friend request with me
    const users = await User.find({_id:{$ne:req.user._id}, pending_requests:{$nin:[...myRequests]}, friends:{$nin:[req.user._id]}}).select({name_first:1, name_last:1, profile_pic:1}).sort()
    
    res.status(200).json({pending:pendingUsers, others:users})
})


const getUser = asyncHandler( async (req,res) => {
    //check if user ID is valid
    // if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
    //     // Not a valid ObjectId
    //     res.status(404).json({message: 'invalid user ID'})
    //     return
    // }    
    //check if user ID exists
    const user = await User.findById(req.params.userId)
        if (!user) { 
            res.status(404).json({message: 'user not found'})
            return
        }
    //check if a friend
    const userIsFriend = req.user.friends.indexOf(user._id.toString())
    if (userIsFriend == -1) {
        const userToSend = await User.findById(req.params.userId).select({name_first:1, name_last:1, profile_pic:1, friends:1})
        .populate({path: 'friends', select:{name_first: 1, name_last:1, profile_pic:1}})
        res.status(200).json({user: userToSend, friend: false})
        return
    } else {
        const userToSend = await User.findById(req.params.userId).select({password:0, pending_requests:0, email:0})
        .populate({path: 'friends', select:{name_first: 1, name_last:1, profile_pic:1}})
        .populate("posts")
        res.status(200).json({user: userToSend, friend: true})
        return
    }   
    

//* alternative check if a friend
//  const isFriend = await FriendRequest.find(
//     {$or: [{to: req.params.userId, from: req.user._id, status:'accepted'}, {from: req.params.userId, to: req.user._id, status:'accepted'}]}
// )

// if (!isFriend) {
//     console.log('not a friend')
//     const user = await User.findById(req.params.userId).select({name_first:1, name_last:1, profile_pic:1})  
//     res.status(200).json(user)
//     return
// }    
//  else {
//     const user = await User.findById(req.params.userId).select({password:0, createdAt:0, updatedAt:0, email:0, role:0, gender: 0})
//     res.status(200).json(user)
// }


})

const userUpdate = () => {

}



module.exports = {
    userRegister, getMe, getAllUsers, userLogin, userUpdate, getUser, uploadProfilePic
}