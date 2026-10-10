
import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        const connectionRes = await mongoose.connect(process.env.MONGO_URI);

        console.log(
            `MongoDB connected! DB host: ${connectionRes.connection.host}`
        );
    } catch (error) {
        console.error("Error in DB connection:", error.message);
        throw error;
    }
};

export default connectDB;
