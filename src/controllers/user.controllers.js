import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteFileFromCloudinary, deleteLocalFile } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const options = {
    httpOnly: true,
    secure: true,
}

const genrateRefreshAndAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.genrateAccessToken()
        const refreshToken = user.genrateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "somthing went in genrating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const { fullname, email, userName, password } = req.body


    if (
        [fullname, email, userName, password].some((feild) => feild?.trim() === "")
    ) {
        throw new ApiError(400, "fullname email userName password are required")
    }

    const existedUser = await User.findOne(
        { $or: [{ email }, { userName }] }
    )

    const avatarLocalPath = req?.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar image is require for profile")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(500, "avatar is not upload on cloudinary")
    }

    if (existedUser) {
        throw new ApiError(409, "user already existed with this email or username")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        userName: userName.toLowerCase(),
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refresToken"
    )

    if (!createdUser) {
        throw new ApiError("something went wrong while register user")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "user register sucessfully", true)
    )
})

const loginUser = asyncHandler(async (req, res) => {

    const { email, userName, password } = req.body;

    if (!(email || userName)) {
        throw new ApiError(400, "enter user name or email to login user")
    }

    const user = await User.findOne({
        $or: [{ email }, { userName }]
    })

    if (!user) {
        throw new ApiError(402, "user not exist with this username or email")
    }

    const isPassValid = await user.isPasswordCorrect(password);

    if (!isPassValid) {
        throw new ApiError(401, "user credential are invalid")
    }

    const { accessToken, refreshToken } = await genrateRefreshAndAccessToken(user._id)

    const logedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: logedInUser, accessToken, refreshToken
                },
                "user logged in successfuly"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(201, {}, "user logout successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

        if (!incommingRefreshToken) {
            throw new ApiError(401, "unautherized request")
        }

        const decodedToken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken._id)

        if (!user.refreshToken) {
            throw new ApiError(401, "invalid refresh token")
        }

        if (!(incommingRefreshToken == user?.refreshToken)) {
            throw new ApiError(401, "refresh token is used or expired")
        }

        const { accessToken, newRefreshToken } = await genrateRefreshAndAccessToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new apiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "access token refreshed successfully"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentUserPass = asyncHandler(async (req, res) => {

    try {
        const { oldPass, newPass, confPass } = req.body

        const user = await User.findById(req.user?._id)

        if (!(newPass == confPass)) {
            throw new ApiError(400, "enter valid conform password")
        }

        const isPassCorrect = await user.isPasswordCorrect(oldPass)

        if (!isPassCorrect) {
            throw new ApiError(401, "incorrect password")
        }

        user.password = newPass
        await user.save({ validateBeforeSave: false })

        return res
            .status(200)
            .json(new apiResponse(200, {}, "password change successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to change password")
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new apiResponse(200, req.user, "current user fetched successfully"))
})

const updateUserDetail = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body

    if (!(fullname && email)) {
        throw new ApiError(400, "enter all feilds")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname: fullname,
                email: email
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new apiResponse(200, user, "profile updated successfully"))
})

const updateAvatar = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const oldAvatarPublicId = user.avatar?.public_id

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar?.url || !avatar?.public_id) {
        throw new ApiError(500, "Error uploading avatar")
    }

    user.avatar = avatar.url
    user.avatarPublicId = avatar.public_id

    await user.save()

    if (oldAvatarPublicId) {
        await deleteFileFromCloudinary(oldAvatarPublicId)
    }

    deleteLocalFile(avatarLocalPath)

    return res.status(200).json(
        new apiResponse(
            200,
            user,
            "Avatar updated successfully"
        )
    )
})

const updateCover = asyncHandler(async (req, res) => {

    const coverLocalPath = req.file?.path

    if (!coverLocalPath) {
        throw new ApiError(400, "Cover file is missing")
    }

    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const oldCoverPublicId = user.cover?.public_id

    const cover = await uploadOnCloudinary(coverLocalPath)

    if (!cover?.url || !cover?.public_id) {
        throw new ApiError(500, "Error uploading avatar")
    }

    user.cover = cover.url
    user.coverPublicId = cover.public_id

    await user.save()

    if (oldCoverPublicId) {
        await deleteFileFromCloudinary(oldCoverPublicId)
    }

    deleteLocalFile(coverLocalPath)

    return res.status(200).json(
        new apiResponse(
            200,
            user,
            "cover image updated successfully"
        )
    )
})

const getUserChanelProfile = asyncHandler(async (req, res) => {
    const { userName } = req.pramas

    if (!userName.trim()) {
        throw new ApiError(400, "user name is missing")
    }

    const channel = await User.aggregate([
    ])
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentUserPass,
    getCurrentUser,
    updateUserDetail,
    updateAvatar,
    updateCover
}