import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getUserWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateCoverImageAvatar, updateUserAvatar } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter=Router();

userRouter.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }
    ]),registerUser)

userRouter.route("/login").post(loginUser)


//secured routes
userRouter.route("/logout").post(verifyJWT,logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/change-password").post(verifyJWT,changeCurrentPassword);
userRouter.route("/current-user").get(verifyJWT,getCurrentUser);
userRouter.route("/update-account").patch(verifyJWT,updateAccountDetails);
userRouter.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar);
userRouter.route("/update-coverImage").patch(verifyJWT,upload.single("coverImage"),updateCoverImageAvatar);
userRouter.route("/c/:username").get(verifyJWT,getUserChannelProfile);
userRouter.route("/history").get(verifyJWT,getUserWatchHistory);


export default userRouter;