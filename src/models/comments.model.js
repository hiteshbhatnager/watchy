import mongoose, { Schema } from "mongoose";

const commentsSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            require: true
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    },
    {
        timestamps: true
    }
)

export const comments = mongoose.model("comments", commentsSchema)