const User = require('../models/userModel')
const FriendRequest = require('../models/friendRequestModel')
const asyncHandler = require('express-async-handler')


const sendFriendRequest = asyncHandler( async (req,res) => {
    
    if (req.user._id == req.params.userId) {
        res.status(400).json({message: 'You cant send a friend request to yourself'})
        return
    }

    //check if pending request already exists
    const requestExists = await FriendRequest.find({from:{_id:req.user._id}, to:{_id:req.params.userId}, status:'pending'}).count()
        if (requestExists > 0) { 
            res.status(400).json({message: 'Pending friend request already exists'})
            return
        }

    const reverseRequestExists = await FriendRequest.find({from:{_id:req.params.userId}, to:{_id:req.user._id}, status:'pending'}).count()
        if (reverseRequestExists > 0) { 
            res.status(400).json({message: 'You already have a pending request from this user'})
            return
        }

    const from = req.user
    const to = await User.findById(req.params.userId)
 
    const newRequest = await FriendRequest.create({
        to,
        from
    })



    res.status(200).json({message: 'Friend request submitted'})
})

const getReceived = asyncHandler( async (req,res) => {
    const requests = await FriendRequest.find({to:{_id:req.user._id}})
    res.status(200).json(requests)
})

const getSent = asyncHandler( async (req,res) => {
    const requests = await FriendRequest.find({from:{_id:req.user._id}})
})

const getRequest = asyncHandler( async (req,res) => {
    const request = await FriendRequest.findById(req.params.requestId)
})

const acceptFriendRequest = asyncHandler( async (req,res) => {
    const request = await FriendRequest.findById(req.params.requestId)
    const sender = request.from
    const receiver = request.to
    if (req.user.id != receiver._id) { //if receiver is not the authenticated user
        res.status(400).json({message: 'Unauthorized action'})
        return
    }
    const updateRequest = await FriendRequest.findByIdAndUpdate(req.params.requestId, {status: 'accepted'})
    const updateSender = await User.findByIdAndUpdate(sender._id, {$push: {friends: receiver}})
    const updateReceiver = await User.findByIdAndUpdate(receiver._id, {$push: {friends: sender}})
    res.status(200).json({message: 'Friend request accepted'})
})

const declineFriendRequest = asyncHandler( async (req,res) => {
    
})

const deleteFriendRequest = asyncHandler( async (req,res) => {
    
})

module.exports = {
    sendFriendRequest, acceptFriendRequest, declineFriendRequest, getReceived, getSent, getRequest, deleteFriendRequest
}