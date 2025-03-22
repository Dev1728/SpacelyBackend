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
        venueCapacity:{
            type:Number,
            required:true
        },
        price:{
            type:String,
            required:true
        },
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
        }
    },
    {timestamps:true}
)

export const SpaceManagementSchema = mongoose.model("SpaceMangementSchema",spaceSchema);