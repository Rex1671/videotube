import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const owner=req.user._id;
    const {content}=req.body;
       if (!content || content.trim() === "") {
        throw new ApiError(400, "No content provided");
    }

    const tweet=await Tweet.create({
        owner,content
    })

    if(!tweet){
        throw new ApiError(400,"Error creating tweet");
    }

    res.status(201).json(new ApiResponse(201,tweet,"Tweet created succefully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId || !mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid or missing userId");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: { createdAt: -1 } 
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ]);

    const totalTweets = await Tweet.countDocuments({
        owner: userId
    });

    return res.status(200).json(
        new ApiResponse(200, {
            tweets,
            pagination: {
                total: totalTweets,
                page,
                limit,
                totalPages: Math.ceil(totalTweets / limit)
            }
        }, "Tweets fetched successfully")
    );
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;
    const { content } = req.body;

    if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid or missing tweetId");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content cannot be empty");
    }

    const tweet = await Tweet.findOneAndUpdate(
        { _id: tweetId, owner: userId },
        {
            $set: {
                content: content.trim()
            }
        },
        { new: true }
    );

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, tweet, "Tweet updated successfully")
    );
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;

    if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid or missing tweetId");
    }

    const deletedTweet = await Tweet.findOneAndDelete({
        _id: tweetId,
        owner: userId
    });

    if (!deletedTweet) {
        throw new ApiError(404, "Tweet not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Tweet deleted successfully")
    );
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}