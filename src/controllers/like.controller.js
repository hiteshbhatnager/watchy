import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/apiError.js"
import { apiResponse, ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { request } from "express"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user._id

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "video is required to like")
    }

    const like = await Like.findOne(
        {
            videoId: videoId,
            likedBy: userId
        }
    )

    if (like) {
        await Like.findByIdAndDelete(like._id)

        return res.status(200)
            .json(
                apiResponse(200, "video unliked succesfully")
            )
    }

    await Like.create({
        videoId,
        likedBy: userId
    })

    return res
        .status(200)
        .json(
            apiResponse(200, "video liked succefully")
        )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}