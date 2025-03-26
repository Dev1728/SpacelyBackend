import mongoose from "mongoose";


const spaceSchema = new mongoose.Schema(
    {
        venueName:{
            type:String,
            required:true
        },
        venueAddress:{
            type:String,
            required:true
        },
        venueCategory:{
            type:String,
            required:true
        },
        venueSubCategory:{
            type:String,
            required:true
        },
        venueMinCapacity:{
            type:Number,
            required:true
        },
        venueMaxCapacity:{
            type:Number,
            required:true
        },
        tokenAmount:{
            type:Number,
            required:true
        },
        rating:{
            type:Number,
            min:1,
            max:5,
            required:true
        },
        reviews: [
            {
                comment: { type: String, required: true },
            }
        ],
        activityStatus:{
            type:String,
            enum:["Active","Inactive"],
            default:"Active"
        },
        availability:{
            type:String,
            enum:["Available","Not Available"],
            default:"Available"
        },
        openingTime:{
            type: String,  
            required: true,
            validate: {
                validator: function (value) {
                    return /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(value); 
                },
                message: "Invalid time format. Use HH:MM AM/PM (e.g., '09:00 AM', '07:30 PM')"
            }
        },
        closingTime:{
            type: String,  
            required: true,
            validate: {
                validator: function (value) {
                    return /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(value); 
                },
                message: "Invalid time format. Use HH:MM AM/PM (e.g., '09:00 AM', '07:30 PM')"
            }
        },
        venueDescription:{
            type:String,
            required:true
        },
        venueBannerImage:{
            type:String,
            required:true
        },
        venuePhotos:{
            type:[String],
            required:true 
        },
        venueVideos:{
            type:[String],
            required:true
        }
    },
    {timestamps:true}
)

export const SpaceManagementSchema = mongoose.model("SpaceMangementSchema",spaceSchema);