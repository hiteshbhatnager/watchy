import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary, deleteFileFromCloudinary, deleteLocalFile } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {

    const limit = req.query.limit
    const pages = req.query.pages

    const skip = (pages - 1) * limit

    const videos = await Video.find()
        .populate("owner", "avatar userName fullname")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)

    if (!videos) {
        throw new ApiError(400, "not able to fetch videos")
    }

    return res
        .status(200)
        .json(new apiResponse(
            200,
            videos,
            "successfully fetched videos "
        ))
})

const uploadVideo = asyncHandler(async (req, res) => {
    const { title, discription, isPublish } = req.body

    if (
        [
            title,
            discription,
            isPublish
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
        isPublish,
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

const getVideoById = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    const video = await Video.findById(videoId)
    console.log(video)

    if (!video) {
        throw new ApiError(400, "video does not exist")
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                video,
                "video fetched successfully"
            )
        )
})

const updateVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { title, discription } = req.body

    if (
        [
            title,
            discription
        ].some(feild => feild?.trim() === "")) {
        throw new ApiError(400, "title and description fields are required")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                discription
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                video,
                "video update successfully"
            )
        )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "video not exist")
    }

    const videoDelete = await Video.findByIdAndDelete(videoId)

    console.log(videoDelete)
    if (!videoDelete) {
        throw new ApiError(400, "get error during deleting video")
    }

    return res
        .status(200)
        .json(
            new apiResponse(200, videoDelete, "video delete successfully")
        )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "video not found")
    }

    const video = await Video.findById(videoId)

    video.isPublish = !video.isPublish;

    await video.save()

    return res
        .status(200)
        .json(
            new apiResponse(200, video, "video publish status update")
        )
})

export {
    getAllVideos,
    uploadVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
}