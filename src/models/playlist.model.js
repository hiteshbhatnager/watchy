import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        discription: {
            type: String,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        videos: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    },
    {
        timestamps: true,
    }
)

export const playlist = mongoose.model("playlist", playlistSchema)