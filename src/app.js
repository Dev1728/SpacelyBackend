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
import categoryRouter from './routes/category.route.js'
import subCategoryRouter from './routes/subCategory.route.js'
import upload from './routes/file.route.js'
//routes declaration
app.use("/api/v1/space",spaceRouter);
app.use("/api/v1/booking",bookingRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/category",categoryRouter);
app.use("/api/v1/subcategory",subCategoryRouter);
app.use("/api/v1/upload",upload)


export {app};  