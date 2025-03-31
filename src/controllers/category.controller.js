import { CategorySchema } from "../models/category.models.js";
import mongoose from 'mongoose';



const getAllCategoryByIDAndName = async (req, res) => {
  try {
    // Extract pagination and filter parameters from the query
    const { page = 1, limit = 10, categoryName, searchKey, searchQuery } = req.query;

    // Convert page and limit to integers
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    // Prepare query filters
    let query = {};
    if (categoryName) {
      query.categoryName = { $regex: new RegExp(`^${categoryName}$`, 'i') }; // Case-insensitive match
    }

    if (searchQuery) {
      // Create a case-insensitive regular expression for the search
      const searchRegex = new RegExp(searchQuery, 'i');
      
      // If searchKey is provided, search only in that specific field
      if (searchKey) {
        switch (searchKey.toLowerCase()) {
          case 'categoryname':
            query.categoryName = searchRegex;
            break;
          default:
            // If searchKey is not recognized, search in all fields
            query.$or = [
              { categoryName: searchRegex }
            ];
        }
      } else {
        // If no searchKey is provided, search in all fields
        query.$or = [
          { categoryName: searchRegex }
        ];
      }
    }

    // Fetch categories based on the filters and select only ID and categoryName
    const categories = await CategorySchema.find(query)
      .select('_id categoryName') // Only return the _id and categoryName fields
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize) // Skip records based on page number
      .limit(pageSize); // Limit the number of records per page

    // Get total count of categories for pagination
    const totalCategories = await CategorySchema.countDocuments(query);

    // Return the categories with pagination data
    return res.status(200).json({
      status: true,
      message: "Categories ID and Name fetched successfully.",
      data: {
        categories,
        totalCategories,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCategories / pageSize),
        pageSize: pageSize,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Error fetching categories.",
      error: error.message,
    });
  }
};
const getAllCategoryData = async (req, res) => {
  try {
    // Extract pagination and filter parameters from the query
    const { page = 1, limit = 10, status, searchKey, searchQuery } = req.query;

    // Convert page and limit to integers
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    // Prepare query filters
    let query = {};
    if (status) {
        query.status = { $regex: new RegExp(`^${status}$`, 'i') }; // Case-insensitive match
    }

    if (searchQuery) {
      // Create a case-insensitive regular expression for the search
      const searchRegex = new RegExp(searchQuery, 'i');
      
      // If searchKey is provided, search only in that specific field
      if (searchKey) {
        switch (searchKey.toLowerCase()) {
          case 'categoryname':
            query.categoryName = searchRegex;
            break;
          case 'description':
            query.Description = searchRegex;
            break;
          default:
            // If searchKey is not recognized, search in all fields
            query.$or = [
              { categoryName: searchRegex },
              { Description: searchRegex }
            ];
        }
      } else {
        // If no searchKey is provided, search in all fields
        query.$or = [
          { categoryName: searchRegex },
          { Description: searchRegex }
        ];
      }
    }

    // Fetch categories based on the filters
    const categories = await CategorySchema.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize) // Skip records based on page number
      .limit(pageSize); // Limit the number of records per page

    // Get total count of categories for pagination
    const totalCategories = await CategorySchema.countDocuments(query);

    // Return the categories with pagination data
    return res.status(200).json({
      status: true,
      message: "Categories fetched successfully.",
      data: {
        categories,
        totalCategories,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCategories / pageSize),
        pageSize: pageSize,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Error fetching categories.",
      error: error.message,
    });
  }
};


const createCategory = async (req, res) => {
  try {
    const { categoryName, Description ,status} = req.body;

    
    if (!categoryName || !Description || !status) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

  
    const isExistedCategory = await CategorySchema.findOne({ categoryName });

    if (isExistedCategory) {
      return res.status(409).json({ success: false, message: "Category already exists!" });
    }

   
    const category = await CategorySchema.create({ categoryName, Description,status });

    return res.status(201).json({ success: true, message: "Category created successfully", data:category });

  } catch (error) {
    console.error("Error in createCategory:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const viewCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ success: false, message: "Please provide category ID" });
    }

    const category = await CategorySchema.findById(categoryId);

 
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

  
    return res.status(200).json({ success: true, message: "Category fetched successfully", data:category });

  } catch (error) {
    console.error("Error in viewCategory:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const updateCategory = async(req,res)=>{

     try {
         const {categoryId} = req.params;   
         if(!categoryId){
             return res.status(404).json({success:false,message:"category Id not Found"});
         }   
         const updateData = req.body;   
         if(!Object.keys(updateData).length=== 0 ){
             return res.status(400).json({success:false,message:"At least one field is required"});
         }   
         const updateCategory =await CategorySchema.findByIdAndUpdate(
              categoryId,
             {$set:updateData},
             {new:true,runValidators:true}
         )   
         if(!updateCategory){
             return res.status(404).json({success:false,message:"category not Found"});
         }   
         return res.status(200).json({success:true,data:updateCategory,message:"category updated Successfully."})
       } catch (error) {
         console.error(error);
         return res.status(500).json({ success: false, message: "Internal Server Error" });
      }
}

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if categoryId is provided
    if (!categoryId) {
      return res.status(400).json({ success: false, message: "Please provide category ID" });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ success: false, message: "Invalid category ID" });
    }

    // Find and delete the category
    const deletedCategory = await CategorySchema.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deletedCategory, // Returning the deleted category
    });

  } catch (error) {
    console.error("Error in deleteCategory:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


  

export {getAllCategoryByIDAndName, getAllCategoryData,createCategory,viewCategory,updateCategory,deleteCategory };
