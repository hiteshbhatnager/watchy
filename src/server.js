import mongoose from 'mongoose';
import express from 'express'
import DB_NAME from "./constant"

const app = express()

    ; (async () => {
        try {
            await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
            app.on("error", () => {
                console.log("error happend")
            })
        } catch (error) {
            console.log(error)
            throw err
        }
    })();