import express from 'express'
import cors from 'cors'

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true}));
app.use(express.static("public")); 

//routes imports
import userRouter from './routes/user.route.js'



//routes declaration
app.use("/api/v1/users",userRouter)


export {app};  