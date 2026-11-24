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

router.route("/get-all-comments").get(getAllComment);

router.route("/add-comments").post(addComment)

router.route("/delete-comments").delete(deleteComment);

router.route("/edit-comments").patch(editComment)

export default router