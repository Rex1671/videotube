import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
{
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true
    },

    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    avatar: {
        type: String,
        required: true
    },

    coverImage: {
        type: String
    },

    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],

    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    },

    refreshToken: {
        type: String,
        select: false
    }

},
{
    timestamps: true
}
)


// PASSWORD HASHING MIDDLEWARE

userSchema.pre("save", async function () {

    console.log("⚙️ Pre-save middleware triggered");

    if (!this.isModified("password")) {
        console.log("Password not modified");
        return;
    }

    console.log("🔐 Hashing password...");

    this.password = await bcrypt.hash(this.password, 10);

    console.log("✅ Password hashed successfully");

})

// PASSWORD CHECK METHOD

userSchema.methods.isPasswordCorrect = async function (password) {

    console.log("🔍 Checking password for user:", this._id);

    const result = await bcrypt.compare(password, this.password);

    console.log("Password match:", result);

    return result;

}


// ACCESS TOKEN GENERATION

userSchema.methods.generateAccessToken = function () {

    console.log("🪪 Generating access token for user:", this._id);

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}


// REFRESH TOKEN GENERATION

userSchema.methods.generateRefreshToken = function () {

    console.log("🔄 Generating refresh token for user:", this._id);

    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}


// MODEL EXPORT

export const User = mongoose.model("User", userSchema);