import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';
import { MongoClient } from 'mongodb';

const connectDB = async () => {
    try {
        const connectionRes = await MongoClient.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n mongoo Database connected !! DB host : ${connectionRes.connection.host}`)
    } catch (error) {
        console.log(`error in db connection ${error}`)
        process.exit(1)
    }
}

export default connectDB