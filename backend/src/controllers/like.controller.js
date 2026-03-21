import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const userId = req.user._id;

    const likeExist = await Like.findOne({
        video: videoId,
        likedBy: userId
    });

    const message = likeExist
        ? (await Like.deleteOne({ _id: likeExist._id }), "Unliked successfully")
        : (await Like.create({ video: videoId, likedBy: userId }), "Liked successfully");

    return res.status(200).json(
        new ApiResponse(200, null, message)
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "No commentId Provided");
    }

    const userId = req.user._id;

    const likeExist = await Like.findOne({
        comment: commentId,
        likedBy: userId
    });

    let message;

    if (likeExist) {
        await Like.deleteOne({ _id: likeExist._id });
        message = "Unliked successfully";
    } else {
        await Like.create({
            comment: commentId,
            likedBy: userId
        });
        message = "Liked successfully";
    }

    return res.status(200).json(
        new ApiResponse(200, null, message)
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "No tweetId Provided");
    }

    const userId = req.user._id;

    const likeExist = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    });

    let message;

    if (likeExist) {
        await Like.deleteOne({ _id: likeExist._id });
        message = "Unliked successfully";
    } else {
        await Like.create({
            tweet: tweetId,
            likedBy: userId
        });
        message = "Liked successfully";
    }

    return res.status(200).json(
        new ApiResponse(200, null, message)
    );
});
const getLikedVideos = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: userId,
                video: { $ne: null } 
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video"
            }
        },
        {
            $unwind: "$video"
        },
        {
            $lookup: {
                from: "users",
                localField: "video.owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                _id: 0,
                videoId: "$video._id",
                title: "$video.title",
                thumbnail: "$video.thumbnail",
                duration: "$video.duration",
                owner: {
                    username: "$owner.username",
                    avatar: "$owner.avatar"
                }
            }
        },
        { $skip: skip },
        { $limit: limit }
    ]);

    return res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});
export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}