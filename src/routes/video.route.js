import express from 'express';

import verifyJwt from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"
import {
    getAllVideos,
    getVideoById,
    updateVideo,
    uploadVideo,
    deleteVideo,
    togglePublishStatus
} from '../controllers/video.controller.js';

const router = express.Router()

router.use(verifyJwt)

router.route("/").get(getAllVideos)

router.route("/upload-video").post(
    upload.fields([
        {
            name: "Video",
            maxCount: 1,
        },
        {
            name: "Thumbnail",
            maxCount: 1
        }
    ]),
    uploadVideo
)

router.route("/get-video/:videoId").get(getVideoById)
router.route("/update-video/:videoId").patch(updateVideo)
router.route("/delete-video/:videoId").delete(deleteVideo)
router.route("/publish-toggle/:videoId").get(togglePublishStatus)

export default router