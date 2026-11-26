import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/apiError.js"
import { apiResponse, ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { request } from "express"

const liketoggle = async (contentId, userId) => {

    if (!mongoose.isValidObjectId(contentId)) {
        throw new ApiError(400, "video is required to like")
    }

    const like = await Like.findOne({
        contentId: contentId,
        likedBy: userId
    })

    if (like) {
        await findByIdAndDelete(like._id);

        return res
            .status(200)
            .json(
                apiResponse(200, like, "unliked succesfully")
            )
    }


    await Like.create({
        videoId: videoId,
        likedBy: userId
    })

    return res.status(200)
        .json(
            apiResponse(200, like, "liked succesfully")
        )
}

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user._id

    liketoggle(videoId, userId)
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user._id

    liketoggle(commentId, userId)
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user._id

    liketoggle(tweetId, userId)
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: video,
                localFeild: videoId,
                foreignFeild: _id,
                as: video
            }
        },
        {
            $unwind: "$video"
        },
        {
            $replaceRoot: {
                newRoot: "$video"
            }
        }
    ])

    return res
        .status(200)
        .json(
            apiResponse(200, likedVideos, "liked video fetched successfully")
        )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}