import asyncHandler from "../utils/asyncHandler";
import apiResponse from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";
import { Comments } from "../models/comments.model";
import mongoose from "mongoose";
import { application } from "express";

const getAllComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const limit = Number(req.query.limit)
    const pages = Number(req.query.pages)

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "video is not existed")
    }

    const skip = (pages - 1) * limit

    const comments = await Comments.findOne({ video: videoId })
        .populate("owner", "userName fullname avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

    if (!comments) {
        throw new ApiError(400, "erroe while searching comment in database")
    }

    return res
        .status(200)
        .json(
            new apiResponse(200, comments, "comments successfully fetched")
        )
})

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body

    const comment = await Comments.create(
        { content }
    )

    if (!content) {
        ApiError(400, "error while adding content of comment")
    }

    return res
        .status(200)
        .json(
            new apiResponse(200, comment, "comment successfully added")
        )
})

const editComment = asyncHandler(async (req, res) => {
    const commentId = req.params
    const content = req.body;

    if (!content) {
        throw new ApiError(400, "comment is required");
    }

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "comment not exist");
    }

    const comments = await Comments.findByIdAndUpdate(
        {
            commentId
        },
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    )

    if (comments) {
        throw new ApiError(400, "comment not found")
    }

    return res
        .status(200)
        .json(
            new apiResponse(200, comments, "comment edited succesfully")
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    const commentId = req.params

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "coment on exist")
    }

    const comment = await Comments.findByIdAndDelete({ commentId });

    if (!comment) {
        throw new ApiError(400, "error while deleting comment")
    }

    return res.status(200)
        .json(
            new apiResponse(200,
                "comment is deleted succesfully"
            )
        )
})

export {
    getAllComments,
    addComment,
    deleteComment,
    editComment,
}