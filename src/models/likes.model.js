import mongoose, { Schema } from "mongoose";

const likesSchema = new Schema(
    {
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        comments: {
            type: Schema.Types.ObjectId,
            ref: "comment"
        }
    },
    {
        timestamps: true,
    }
)

export const Likes = mongoose.model("Likes", likesSchema)