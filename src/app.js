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
// import userRouter from './routes/user.route.js'
import adminRouter from './routes/admin.route.js'
import bookingRouter from  './routes/bookingmanagement.route.js' 
import spaceRouter from './routes/space.route.js'
//routes declaration
app.use("/api/v1/space",spaceRouter);
app.use("/api/v1/booking",bookingRouter);
app.use("/api/v1/admin",adminRouter);


export {app};  