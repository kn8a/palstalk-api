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

//* get received requests
const getReceived = asyncHandler( async (req,res) => {
    const requests = await FriendRequest.find({to:{_id:req.user._id, status:'pending'}}).populate({path: 'from', select:{name_first: 1, name_last:1, profile_pic:1} })
    res.status(200).json(requests)
})

//* get sent requests
const getSent = asyncHandler( async (req,res) => {
    const requests = await FriendRequest.find({from:{_id:req.user._id, status:'pending'}}).populate({path: 'to', select:{name_first: 1, name_last:1, profile_pic:1} })
})

//*get single request
const getRequest = asyncHandler( async (req,res) => {
    const request = await FriendRequest.findById(req.params.requestId).populate({path: 'from', select:{name_first: 1, name_last:1, profile_pic:1} }).populate({path: 'to', select:{name_first: 1, name_last:1, profile_pic:1} })
    const sender = request.from
    const receiver = request.to
    if (req.user.id != receiver._id || req.user.id != sender._id) { //if authenticated user is not receiver nor sender
        res.status(400).json({message: 'You are not authorized to access this resource'})
        return
    }
})

//*accept friend request
const acceptFriendRequest = asyncHandler( async (req,res) => {
    const request = await FriendRequest.findById(req.params.requestId)
    if (request.status == 'accepted') {
        res.status(400).json({message: 'This request was already accepted'})
    }
    if (request.status == 'declined') {
        res.status(400).json({message: 'This request has already been declined'})
    }
    const sender = request.from
    const receiver = request.to
    if (req.user.id != receiver._id) { //if receiver is not the authenticated user
        res.status(400).json({message: 'Unauthorized action'})
        return
    }
    const updateRequest = await FriendRequest.findByIdAndUpdate(req.params.requestId, {status: 'accepted'})
    const updateSender = await User.findByIdAndUpdate(sender._id, {$push: {friends: receiver}})
    const updateReceiver = await User.findByIdAndUpdate(receiver._id, {$push: {friends: sender}})
    // const deleteRequest = await FriendRequest.findByIdAndDelete(req.params.requestId)
    res.status(200).json({message: 'Friend request accepted'})
})

//*decline friend request
const declineFriendRequest = asyncHandler( async (req,res) => {
    const request = await FriendRequest.findById(req.params.requestId)

    if (request.status == 'accepted') {
        res.status(400).json({message: 'This request was already accepted'})
    }
    if (request.status == 'declined') {
        res.status(400).json({message: 'This request has already been declined'})
    }
    
    const receiver = request.to
    if (req.user.id != receiver._id) { //if receiver is not the authenticated user
        res.status(400).json({message: 'Unauthorized action'})
        return
    }

    const updateRequest = await FriendRequest.findByIdAndUpdate(req.params.requestId, {status: 'declined'})
    res.status(200).json({message: 'Friend request declined'})
})

//*cancel friend request
const cancelFriendRequest = asyncHandler( async (req,res) => {
    const request = await FriendRequest.findById(req.params.requestId)
    
    if (request.status == 'accepted') {
        res.status(400).json({message: 'This request was already accepted'})
    }
    if (request.status == 'declined') {
        res.status(400).json({message: 'This request was already declined'})
    }
    if (request.status == 'cancelled') {
        res.status(400).json({message: 'This request was already cancelled'})
    }

    const sender = request.from
    if (req.user.id != sender._id) { //if sender is not the authenticated user
        res.status(400).json({message: 'Unauthorized action'})
        return
    }

    const updateRequest = await FriendRequest.findByIdAndUpdate(req.params.requestId, {status: 'cancelled'})

    res.status(200).json({message: 'Friend request cancelled'})
})

//^unfriend - rework this to work based on userID instead of request ID
const unfriend = asyncHandler( async (req,res) => {
    const request = await FriendRequest.findById(req.params.requestId)

    if (request.status == 'declined') {
        res.status(400).json({message: 'This request was already declined'})
    }
    if (request.status == 'cancelled') {
        res.status(400).json({message: 'This request was already cancelled'})
    }
    if (request.status == 'unfriended') {
        res.status(400).json({message: 'You already unfriended this person'})
    }

    const sender = request.from
    const receiver = request.to
    if (req.user.id != receiver._id || req.user.id != sender._id) { //if authenticated user is not receiver nor sender
        res.status(400).json({message: 'You are not authorized to access this resource'})
        return
    }
    const updateRequest = await FriendRequest.findByIdAndUpdate(req.params.requestId, {status: 'unfriended'})
    const updateSender = await User.findByIdAndUpdate(sender._id, {$pull: {friends: receiver}})
    const updateReceiver = await User.findByIdAndUpdate(receiver._id, {$pull: {friends: sender}})

    res.status(200).json({message: 'Unfriended successfully'})
})

module.exports = {
    sendFriendRequest, acceptFriendRequest, declineFriendRequest, getReceived, getSent, getRequest, cancelFriendRequest, unfriend
}