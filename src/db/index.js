import mongoose from 'mongoose';
import { DB_NAME } from '../constant';

const connectDB = async () => {
    try {
        const connectionRes = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n mongoo Database connected !! DB host : ${connectionRes}`)
    } catch (error) {
        console.log(`error in db connection ${error}`)
        process.exit(1)
    }
}