import mongoose from "mongoose";


const categorySchema = new mongoose.Schema(
    {
       
        categoryName:{
            type:String,
            required:true
        },
        Description:{
            type:String,
            required:true
        },
        status:{
            type:String,
            enum:["Active","Inactive"],
            default:"Active"
        }
    },
    {timestamps:true}
);


export const CategorySchema = mongoose.model("CategorySchema",categorySchema)