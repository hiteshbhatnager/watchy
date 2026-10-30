import express from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controllers.js";
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

export default router