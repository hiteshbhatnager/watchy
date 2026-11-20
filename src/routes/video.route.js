import express from 'express';

import verifyJwt from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"
import { uploadVideo } from '../controllers/video.controller.js';

const router = express.Router()

router.use(verifyJwt)

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

export default router