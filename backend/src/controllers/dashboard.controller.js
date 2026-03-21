import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const totalVideos = await Video.countDocuments({ owner: userId });

    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    });

    const userVideos = await Video.find({ owner: userId }).select("_id");

    const videoIds = userVideos.map(v => v._id);

    const totalLikes = await Like.countDocuments({
        video: { $in: videoIds }
    });

    const viewsData = await Video.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(userId) }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
    ]);

    const totalViews = viewsData[0]?.totalViews || 0;

    return res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            totalSubscribers,
            totalLikes,
            totalViews
        }, "Channel stats fetched successfully")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                createdAt: -1 // latest first
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ]);

    const totalVideos = await Video.countDocuments({
        owner: userId
    });

    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            pagination: {
                total: totalVideos,
                page,
                limit,
                totalPages: Math.ceil(totalVideos / limit)
            }
        }, "Videos fetched successfully")
    );
});

export {
    getChannelStats,
    getChannelVideos
}