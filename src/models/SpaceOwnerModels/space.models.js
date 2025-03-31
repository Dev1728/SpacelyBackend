import mongoose from "mongoose";


const ownerSpaceSchema = new mongoose.Schema(
    {
        venueName:{
            type:String,
            required:true
        },
        venueAddress:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        perHour:{
                type: String,
                default:"01:00",  
                validate: {
                    validator: function (value) {
                        return /^(0[1-9]|1[0-2]):[0-5][0-9]$/.test(value); 
                    },
                    message: "Invalid time format."
                }
        },
        availability:{
            type:String,
            required:true,
            enum:["Available","Not Available"],
            default:"Available"
        },
        googleMapLink:{
            type:String,
            required:true
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
        },
        venueVideos:{
            type:[String],
        }
    },
    {timestamps:true}
)

export const OwnerSpaceManagementSchema = mongoose.model("OwnerSpaceMangementSchema",ownerSpaceSchema);