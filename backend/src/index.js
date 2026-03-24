import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config();

connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000, "0.0.0.0", () => {
    console.log("Server is running at port: ", process.env.PORT || 8000);
  });
})
.catch((err)=>{
  console.error("Server startup failed!", err);
})


















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