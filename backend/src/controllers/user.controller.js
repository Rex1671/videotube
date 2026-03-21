import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose"


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while accesing refresh token")
    }
}



const registerUser = asyncHandler(async (req, res) => {

    console.log("🚀 Register user API called");

    const { fullname, username, password, email } = req.body

    console.log("📦 Request body:", req.body);

    if (
        [fullname, username, password, email].some((field) => field?.trim() === "")
    ) {
        console.log("❌ Some required fields are empty");
        throw new ApiError(400, "All fields are required")
    }

    console.log("✅ All fields present");

    console.log("🔍 Checking existing user...");
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        console.log("❌ User already exists");
        throw new ApiError(409, "User already exist with email or username")
    }

    console.log("✅ No existing user found");

    const avatarlocalpath = req.files?.avatar?.[0]?.path
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    console.log("📂 Avatar path:", avatarlocalpath);
    console.log("📂 Cover path:", coverImageLocalPath);

    if (!avatarlocalpath) {
        console.log("❌ Avatar not provided");
        throw new ApiError(400, "Avatar image not available")
    }

    console.log("☁ Uploading avatar to Cloudinary...");
    const avatar = await uploadOnCloudinary(avatarlocalpath)
    console.log("☁ Uploading cover image to Cloudinary...");
    const coverImage = coverImageLocalPath
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null

    console.log("✅ Upload finished");
    console.log(`Avatar URL: ${avatar?.url}`)
    console.log(`Cover URL: ${coverImage?.url}`)

    if (!avatar) {
        console.log("❌ Avatar upload failed");
        throw new ApiError(400, "Avatar file is required")
    }

    console.log("🧑 Creating user in database...");

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    console.log("✅ User created with ID:", user._id);

    console.log("🔍 Fetching created user without password");

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        console.log("❌ Failed to fetch created user");
        throw new ApiError(500, "Something went wrong while registering user")
    }

    console.log("🎉 Registration successful");

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {

    console.log("🚀 Login API called");

    const { email, username, password } = req.body;

    console.log("📦 Request body:", req.body);

    // Validate input
    if (!(username || email) || !password) {
        console.log("❌ Missing username/email or password");
        throw new ApiError(400, "Username or email and password required");
    }

    console.log("🔍 Searching for user in database...");

    const user = await User.findOne({
        $or: [{ username }, { email }]
    }).select("+password")

    if (!user) {
        console.log("❌ User not found");
        throw new ApiError(404, "User doesn't exist");
    }

    console.log("✅ User found:", user._id);

    console.log("🔐 Verifying password...");

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        console.log("❌ Password incorrect");
        throw new ApiError(401, "Invalid Credentials");
    }

    console.log("✅ Password verified");

    console.log("🔑 Generating access & refresh tokens...");

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id);

    console.log("✅ Tokens generated");
    console.log("AccessToken:", accessToken);
    console.log("RefreshToken:", refreshToken);

    console.log("📥 Fetching logged-in user without sensitive fields");

    const loggedInUser = await User
        .findById(user._id)
        .select("-password -refreshToken");

    console.log("👤 Logged in user:", loggedInUser);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    console.log("🍪 Setting cookies with options:", options);

    console.log("🎉 Login successful, sending response...");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: 1 }
        },
        { new: true }
    )
    const options = {
        httpOnly: true,
        secure: true
    }


    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out"))
})



const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);
        if (!user)
            throw new ApiError(401, "Invalid Refresh Token");
        if (incomingRefreshToken !== user?.refreshAccessToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const newTokens = await generateAccessAndRefreshTokens(user._id);
        return res.status(200)
            .cookie("accessToken", newTokens.accessToken, options)
            .cookie("refreshToken", newTokens.refreshToken, options)
            .json(new ApiResponse(200, { "Access Token": newTokens.accessToken, "Refresh Token": newTokens.refreshToken }))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token")
    }
})


const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPass, newPass } = req.body;

    const accessToken = req.cookies.accessToken;

    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const userDoc = await User.findById(decodedToken._id);

        const isPasswordCorrect = await userDoc.isPasswordCorrect(oldPass);
        if (!isPasswordCorrect) {
            throw new ApiError(401, "Wrong Old Password");
        }

        userDoc.password = newPass;
        await userDoc.save({ validateBeforeSave: false });

        // const newHashedPass = await bcrypt.hash(newPass, 10);

        // await User.findByIdAndUpdate(
        //     decodedToken._id,
        //     { $set: { password: newHashedPass } }
        // );

        return res.status(200).json(
            new ApiResponse(200, {}, "Password Changed Successfully")
        );
    } catch (error) {
        throw new ApiError(401, "Invalid Password")

    }
});

const getCurrentUser = asyncHandler(async (req, res) => {
    // const decodedToken=await jwt.verify(req.cookies.accessToken,process.env,ACCESS_TOKEN_SECRET);
    // const user=decodedToken._id;
    return res.status(200).json(200, req.user, "current User Fetched")
})


const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body;
    if (!fullname || !email) throw new ApiError(400, "All fields are required");

    const user = await User.findByIdAndUpdate(req.user?._id, { $set: { fullname, email } }, { new: true }).select("-password");

    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Error while uploading avatar image");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { avatar: avatar.url } },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new ApiResponse(200, user, "Avatar uploaded successfully")
    );
});
const updateCoverImageAvatar = asyncHandler(async (req, res) => {

    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage) {
        throw new ApiError(400, "Error while uploading cover image");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { coverImage: coverImage.url } },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new ApiResponse(200, user, "Cover image uploaded successfully")
    );
});



const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ]);

    if (!channel?.length) {
        throw new ApiError(404, "channel doesnt exist")
    }

    return res.status(200).json(new ApiResponse(200, channel[0], "User channel fetched successfully"));
});


const getUserWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [{
                                $project: {
                                    fullname: 1,
                                    username: 1,
                                    avatar: 1
                                }
                            }]
                        }
                    }, 
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])


    return res.status(200).json(new ApiResponse( 200,user[0].watchHistory),"Watch History fetched successfully")
})


export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateCoverImageAvatar, updateUserAvatar, getUserChannelProfile, getUserWatchHistory }