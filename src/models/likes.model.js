import mongoose, { Schema } from "mongoose";

const likesSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    },
    {
        timestamps: true,
    }
)

export const likes = mongoose.model("likes", likesSchema)