const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var createError = require('http-errors');

//jwt token generator
const genToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

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
        profile_pic: `https://robohash.org/${name_first}-${name_last}.png`
    })

    if (newUser) {
        res.status(200).json({message: 'Profile created successfully'})
    }
})

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
    }

})

const getMe = asyncHandler( async (req,res) => {
    console.log(req.user._id)
    const user = await User.findById(req.user._id)
    res.status(200) //ok
    res.json(user)
})

const getUser = asyncHandler( async (req,res) => {
    //check if user ID is valid
    if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
        // Not a valid ObjectId
        res.status(404).json({message: 'invalid user ID'})
        return
    }    
    //check if user ID exists
    const userExists = await User.find({_id: req.params.userId}).count()
        if (userExists == 0) { 
            res.status(404).json({message: 'user not found'})
            return
        }
    //check if a friend
    if (!req.user.friends.find(friend => friend._id == req.params.userId)) {
        console.log('not a friend')
        const user = await User.findById(req.params.userId).select({name_first:1, name_last:1, profile_pic:1})  
        res.status(200).json(user)
        return
    } else {
        const user = await User.findById(req.params.userId).select({password:0, createdAt:0, updatedAt:0, email:0, role:0})
        res.status(200).json(user)
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
    userRegister, getMe, userLogin, userUpdate, getUser
}