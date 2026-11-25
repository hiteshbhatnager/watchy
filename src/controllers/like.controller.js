import asyncHandler from "../utils/asyncHandler.js"
import Likes from "../models/likes.model.js"

const getAllLikes = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})