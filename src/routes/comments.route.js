import express from "express";
import {
    getAllComment,
    addComment,
    deleteComment,
    editComment,
} from "../controllers/comment.controller.js"
import verifyJwt from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyJwt)

router.route("/get-all-comments/:videoId").get(getAllComment);

router.route("/add-comments/:videoId").post(addComment)

router.route("/delete-comments/:commentId").delete(deleteComment);

router.route("/edit-comments/:commentId").patch(editComment)

export default router