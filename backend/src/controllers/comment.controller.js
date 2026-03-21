import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"


const getVideoComments = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    const pageNumber = Math.max(parseInt(page) || 1, 1)
    const limitNumber = Math.min(parseInt(limit) || 10, 50)

    const videoExists = await Video.exists({ _id: videoId })

    if (!videoExists) {
        throw new ApiError(404, "Video not found")
    }

    const comments = await Comment.find({ video: videoId })
        .populate("owner", "username avatar")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)

         //or Comment.aggregate([
    //    { $match: { video: ObjectId(videoId) } },
    //    {
    //      $lookup:{
    //        from:"users",
    //        localField:"owner",
    //        foreignField:"_id",
    //        as:"owner"
    //      }
    //    }
    // ])
    const totalComments = await Comment.countDocuments({ video: videoId })

    res.status(200).json(
        new ApiResponse(200, {
            comments,
            totalComments,
            page: pageNumber,
            limit: limitNumber
        }, "Comments fetched successfully")
    )
})



const addComment = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { content } = req.body

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    if (!content || !content.trim()) {
        throw new ApiError(400, "Content is required")
    }

    const videoExists = await Video.exists({ _id: videoId })

    if (!videoExists) {
        throw new ApiError(404, "Video not found")
    }

    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user._id
    })

    const populatedComment = await comment.populate("owner", "username avatar")

    res.status(201).json(
        new ApiResponse(201, populatedComment, "Comment posted successfully")
    )
})



const updateComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params
    const { content } = req.body

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId")
    }

    if (!content || !content.trim()) {
        throw new ApiError(400, "Content is required")
    }

    const comment = await Comment.findOneAndUpdate(
        { _id: commentId, owner: req.user._id },
        { content: content.trim() },
        { new: true, runValidators: true }
    )

    if (!comment) {
        throw new ApiError(404, "Comment not found or not authorized")
    }

    res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    )
})



const deleteComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId")
    }

    const comment = await Comment.findOneAndDelete({
        _id: commentId,
        owner: req.user._id
    })

    if (!comment) {
        throw new ApiError(404, "Comment not found or not authorized")
    }

    res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    )
})



export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}