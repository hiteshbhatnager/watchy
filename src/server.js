import mongoose from 'mongoose';
import express from 'express';
import DB_NAME from './constant'

const app = express();

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on('error', (error) => {
            console.log("ERROR :", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`server is live on https://localhost${process.env.PORT}`)
        })
    } catch (error) {
        console.log("error happend in mongodb server", error)
    }
})()