import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//import router 

import userRouter from "./routes/user.route.js"
import videoRouter from "./routes/video.route.js"
import commentRouter from "./routes/comments.route.js"

//router declaration

app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/user", userRouter);
app.use("/api/v1/video", videoRouter)

//https://localhost:8000/api/v1/route/

export { app };