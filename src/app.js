import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';



const app=express();


app.use(cors({
    origin:process.env.CORS_ORIGIN
}));


app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());



//routes

import userRouter from './routes/user.routes.js';

//router declaration
app.use("/api/v1/users",userRouter)


app.get('/',(req,res)=>{
    res.send("Hello");
})

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message
  });
});


export {app}