
import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import fs from 'fs';

const getAllVideos = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = req.query.query;
    const sortBy = req.query.sortBy || "createdAt";
    const sortType = req.query.sortType === "asc" ? 1 : -1;
    const userId = req.query.userId;

    const skip = (page - 1) * limit;

    const filter = { isPublished: true };
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }
    if (userId) {
        filter.owner = userId;
    }

    const videos = await Video.find(filter)
        .populate("owner", "username avatar fullName")
        .sort({ [sortBy]: sortType })
        .skip(skip)
        .limit(limit);

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    
    let videoPath;
    if (req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0) {
        videoPath = req.files.videoFile[0].path;
    }
    let thumbnailPath;
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailPath = req.files.thumbnail[0].path;
    }

    if (!videoPath) {
        throw new ApiError(400, "Video file is required");
    }
    if (!thumbnailPath) {
        throw new ApiError(400, "Thumbnail file is required");
    }

    const owner = req.user._id;

    const videopathResponse = await uploadOnCloudinary(videoPath);
    if (!videopathResponse) {
        throw new ApiError(400, "Video upload to Cloudinary failed");
    }
    
    const thumbnailpathResponse = await uploadOnCloudinary(thumbnailPath);
    if (!thumbnailpathResponse) {
        throw new ApiError(400, "Thumbnail upload to Cloudinary failed");
    }

    const video = await Video.create({
        title,
        description,
        thumbnail: thumbnailpathResponse.url,
        videoFile: videopathResponse.url,
        duration: videopathResponse.duration || 0,
        views: 0,
        isPublished: true,
        owner
    });

    if (!video) {
        throw new ApiError(500, "Error while saving video data to database");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video uploaded successfully")
    );
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }
    
    // Also correctly updating views automatically when fetched successfully!
    const video = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { views: 1 } },
        { new: true }
    ).populate("owner", "username avatar fullName");

    if (!video) {
        throw new ApiError(404, "Video data not found");
    }
    
    res.status(200).json(new ApiResponse(200, video, "Video data extracted successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid VideoId");
    }

    const { title, description } = req.body;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!title || !description || !thumbnailLocalPath) {
        throw new ApiError(400, "All fields are required");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    await fs.unlinkSync(thumbnailLocalPath);
    const video = await Video.findOneAndUpdate(
        { _id: videoId, owner: req.user._id }, // ✅ correct
        {
            $set: {
                title,
                description,
                thumbnail: thumbnail.url
            }
        },
        { new: true }
    );

    if (!video) {
        throw new ApiError(404, "Video not found or unauthorized");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Data updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid VideoId")
    }

    const ownerId = req.user._id

    const video = await Video.findOneAndDelete({
        _id: videoId,
        owner: ownerId
    })

    if (!video) {
        throw new ApiError(404, "Video not found or unauthorized")
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )

})

const togglePublishStatus = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    const ownerId = req.user._id

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found with the given VideoId")
    }

    if (video.owner.toString() !== ownerId.toString()) {
        throw new ApiError(403, "Unauthorized access")
    }

    video.isPublished = !video.isPublished

    await video.save()

    res.status(200).json(
        new ApiResponse(200, video, "Publish status toggled successfully")
    )
})




export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}