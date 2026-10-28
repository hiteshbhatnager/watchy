import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";

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

export default router