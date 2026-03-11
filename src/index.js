import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({
  path: "../.env"
});

import express from 'express';

console.log(process.env.PORT)
// const app = express();
// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error) => {
//             console.log("error", error);

//         })

//         app.listen(process.env.PORT,()=>{
//             console.log("App is listening on "+process.env.PORT)
//         })
//     } catch (error) {
//         console.log(error);
//     }
// })()