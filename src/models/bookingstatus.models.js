import mongoose  from "mongoose";


const bookingStatusSchema = new mongoose.Schema(
    {
        status:{
            type:String,
            enum:["pending","confirmed","cancelled","completed"],
            default:"pending",
            required:true,
            unique:true
        }
    },
    {timestamps:true}
)

export const BookingStatus = mongoose.model("BookingStatus",bookingStatusSchema);