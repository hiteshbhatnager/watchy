import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary, deleteFileFromCloudinary, deleteLocalFile } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const getAllVideos = asyncHandler(async (req, res) => {

})

const uploadVideo = asyncHandler(async (req, res) => {
    const { title, discription } = req.body

    if (
        [
            title,
            discription
        ].some(feild => feild?.trim()) == ""
    ) {
        throw new ApiError(400, "title and discription needed to upload video")
    }

    const localVideoPath = req?.files?.Video[0]?.path

    if (!localVideoPath) {
        throw new ApiError(400, "video path not found")
    }

    const localThumbnailPath = req?.files?.Thumbnail[0]?.path


    if (!localThumbnailPath) {
        throw new ApiError(400, "thumbnail path not found")
    }

    const video = await uploadOnCloudinary(localVideoPath);
    const thumbnail = await uploadOnCloudinary(localThumbnailPath);
    console.log(video.duration)

    deleteLocalFile(localVideoPath);
    deleteLocalFile(localThumbnailPath);

    const videoModule = await Video.create({
        title,
        discription,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        duration: video.duration,
    })

    const createdVideo = await Video.findById(videoModule._id)

    return res
        .status(200)
        .json(
            new apiResponse(200, createdVideo, "video is uploaded succefully")
        )
})

export {
    uploadVideo
}