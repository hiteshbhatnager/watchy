// require(dontenv).config({ Path: '../env' })
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: "./.env" });

await connectDB();

// const app = express();

// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
//         app.on('error', (error) => {
//             console.log("ERROR :", error);
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`server is live on https://localhost${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.log("error happend in mongodb server", error)
//     }
// })()