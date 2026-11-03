import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentUserPass,
    getCurrentUser,
    updateUserDetail,
    updateAvatar,
    updateCover
} from "../controllers/user.controllers.js";

import verifyJwt from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const router = express.Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)


//secured route

router.route("/logout").post(verifyJwt, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJwt, changeCurrentUserPass)

router.route("/get-current-user").post(verifyJwt, getCurrentUser)

router.route("/update-profile").post(verifyJwt, updateUserDetail)

router.route("/update-avatar").post(upload.single("avatar"), updateAvatar)

router.route("/update-cover").post(upload.single("cover"), updateCover)

export default router