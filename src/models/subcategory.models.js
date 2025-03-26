import mongoose from "mongoose";


const subCategorySchema = new mongoose.Schema(
    {
     
        subCategoryName:{
            type:String,
            required:true
        },
        parentCategory:{
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


export const SubCategorySchema = mongoose.model("SubCategorySchema",subCategorySchema)