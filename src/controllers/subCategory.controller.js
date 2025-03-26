import { SubCategorySchema } from "../models/subcategory.models.js";
import mongoose from 'mongoose'
const getAllSubCategoryData = async (req, res) => {
    try {
        // Extract pagination and filter parameters from the query
        const { page = 1, limit = 10, status, parentCategory, searchKey, searchQuery } = req.query;

        // Convert page and limit to integers
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);

        // Prepare query filters
        let query = {};
        
        if (status) {
            query.status = { $regex: new RegExp(`^${status}$`, 'i') }; // Case-insensitive match
        }

        if (parentCategory) {
            query.parentCategory = parentCategory; // Filter by parent category if provided
        }

        if (searchQuery) {
            // Create a case-insensitive regular expression for the search
            const searchRegex = new RegExp(searchQuery, 'i');

            // If searchKey is provided, search only in that specific field
            if (searchKey) {
                switch (searchKey.toLowerCase()) {
                    case 'subcategoryname':
                        query.subCategoryName = searchRegex;
                        break;
                    case 'description':
                        query.Description = searchRegex;
                        break;
                    case 'parentcategory':
                        query.parentCategory = searchRegex;
                        break;
                    default:
                        // If searchKey is not recognized, search in all fields
                        query.$or = [
                            { subCategoryName: searchRegex },
                            { Description: searchRegex },
                            { parentCategory: searchRegex }
                        ];
                }
            } else {
                // If no searchKey is provided, search in all fields
                query.$or = [
                    { subCategoryName: searchRegex },
                    { Description: searchRegex },
                    { parentCategory: searchRegex }
                ];
            }
        }

        // Fetch subcategories based on the filters
        const subCategories = await SubCategorySchema.find(query)
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * pageSize) // Skip records based on page number
            .limit(pageSize); // Limit the number of records per page

        // Get total count of subcategories for pagination
        const totalSubCategories = await SubCategorySchema.countDocuments(query);

        // Return the subcategories with pagination data
        return res.status(200).json({
            status: true,
            message: "Subcategories fetched successfully.",
            data: {
                subCategories,
                totalSubCategories,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalSubCategories / pageSize),
                pageSize: pageSize,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Error fetching subcategories.",
            error: error.message,
        });
    }
};


const createSub = async(req,res)=>{
    try {
        const{subCategoryName ,status,parentCategory, Description} = req.body;
    
        if(!subCategoryName || !status || !parentCategory || !Description){
            return res.status(401).json({success:false,message:"Please provide all fields"});
        }
    
        const isExistedSub = await SubCategorySchema.findOne({
            $and:[{subCategoryName},{parentCategory}]
        })
    
        if(isExistedSub){
            return res.status(409).json({success:false,message:"Already existed this subCategory"});
        }
    
        const subCategory = await SubCategorySchema.create({
            subCategoryName,
            parentCategory,
            status,
            Description
        })
    
        if(!subCategory){
            return res.status(500).json({success:false,message:"Something went wrong with create"});
        }
        return res.status(201).json({success:true,data:subCategory,message:"SubCategory Created Successfully"});

    } catch (error) {
        console.error("Error in createCategory:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const viewSubCategory = async(req,res)=>{
    try {
        const{categoryId} = req.params;

        if(!categoryId){
            return res.status(401).json({success:false,message:"Category ID is not found "})
        }
        const subcategory = await SubCategorySchema.findById(categoryId);

        if(!subcategory){
            return res.status(404).json({success:false,message:"subCategory not found"});
        }

        return res.status(200).json({success:true,data:subcategory,message:"subcategory fetch successfully"})
    } catch (error) {
        console.error("Error in createCategory:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const updateSubCategory = async(req,res)=>{
     try {
         const {categoryId} = req.params;   
         if(!categoryId){
             return res.status(404).json({success:false,message:"Subcategory Id not Found"});
         }   
         const updateData = req.body;   
         if(!Object.keys(updateData).length=== 0 ){
             return res.status(400).json({success:false,message:"At least one field is required"});
         }   
         const updateCategory =await SubCategorySchema.findByIdAndUpdate(
              categoryId,
             {$set:updateData},
             {new:true,runValidators:true}
         )   
         if(!updateCategory){
             return res.status(404).json({success:false,message:"Subcategory not Found"});
         }   
         return res.status(200).json({success:true,data:updateCategory,message:"Subcategory updated Successfully."})
       } catch (error) {
         console.error(error);
         return res.status(500).json({ success: false, message: "Internal Server Error" });
      }
}

const deleteSubCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if categoryId is provided
    if (!categoryId) {
      return res.status(400).json({ success: false, message: "Please provide Sub category ID" });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ success: false, message: "Invalid Subcategory ID" });
    }

    // Find and delete the category
    const deletedCategory = await SubCategorySchema.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({
      success: true,
      message: "SubCategory deleted successfully",
      data: deletedCategory, // Returning the deleted category
    });

  } catch (error) {
    console.error("Error in deleteCategory:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {getAllSubCategoryData,createSub,viewSubCategory,updateSubCategory,deleteSubCategory};