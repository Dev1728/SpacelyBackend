
import { SpaceManagementSchema } from "../models/space.models.js";





const getAllSpaceManagement =async (req, res) => {
    try {
      // Extract pagination and filter parameters from the query
      const { page = 1, limit = 10, activityStatus,availability,searchKey,searchQuery } = req.query;
  
      // Convert page and limit to integers
      const pageNumber = parseInt(page);
      const pageSize = parseInt(limit);
  
      // Prepare query filters
      let query = {};
      if (activityStatus) {
        query.activityStatus = activityStatus; // Filter by activityStatus if provided
      }

      if (availability) {
        query.availability = availability; // Filter by availabilityStatus if provided
      }
     
  
      if (searchQuery) {
        // Create a case-insensitive regular expression for the search
        const searchRegex = new RegExp(searchQuery, 'i');
  
        // If searchKey is provided, search only in that specific field
        if (searchKey) {
          switch (searchKey.toLowerCase()) {
            case 'venueName':
              query.venueName = searchRegex;
              break;
            case 'venueAddress':
              query.venueAddress = searchRegex;
              break;
            default:
              // If searchKey is not recognized, fall back to searching all fields
              query.$or = [
                { venueName: searchRegex },
                { venueAddress: searchRegex }
              ];
          }
        } else {
          // If no searchKey is provided, search in all fields as before
          query.$or = [
            { venueName: searchRegex },
            { venueAddress: searchRegex }
          ];
        }
      }
      // Find admins based on the filters
      const space = await SpaceManagementSchema.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize) // Skip records based on page number
        .limit(pageSize); // Limit the number of records per page
  
      // Get total count of admins for pagination
      const totalspace = await SpaceManagementSchema.countDocuments(query);
  
      // Return the admins with pagination data
      return res.status(200).json({
        status: true,
        message: "SpaceData fetched successfully.",
        data: {
          space,
          totalspace,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalspace / pageSize),
          pageSize: pageSize,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Error fetching spaces.",
        error: error.message,
      });
    }
}

const createSpace = async(req,res)=>{
    try {
        const{venueName,venueAddress,venueCapacity,price,openingTime,closingTime}= req.body;

        if(!venueName || !venueAddress || !venueCapacity || !price || !openingTime || !closingTime){
            return res.status(404).json({success:false,message:"All fields are required"});
        }

        const isexistedSpace = await SpaceManagementSchema.findOne({
            $and:[{venueName},{venueAddress},{venueCapacity}]
        })

        if(isexistedSpace){
            return res.status(409).json({success:false,message:"space is Already existed"});
        }

        const space = await SpaceManagementSchema.create({
            venueName,
            venueAddress,
            venueCapacity,
            price,
            openingTime,
            closingTime
        })

        if(!space){
            return res.status(401).json({success:false,message:"Something went with create space"})
        }

        const createdSpace = await SpaceManagementSchema.findById(space._id);

        return res.status(200).json({success:true,space:createdSpace,message:"space created Successfully !!"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


const viewSpace  = async(req,res)=>{
    try {
        const{spaceId} = req.params;

        if(!spaceId){
            return res.status(404).json({success:false,message:"Space Id not Found"});
        }

        const space = await SpaceManagementSchema.findById(spaceId);

        if(!space){
            return res.status(404).json({success:false,message:"Space Not Found"})
        }

        return res.status(200).json({success:true,space:space,message:"space retrieve successfully"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const updateSpace =async(req,res)=>{
        try {
          const {spaceId} = req.params;
  
          if(!spaceId){
              return res.status(404).json({success:false,message:"Space Id not Found"});
          }
  
          const updateData = req.body;
  
          if(!Object.keys(updateData).length=== 0 ){
              return res.status(400).json({success:false,message:"At least one field is required"});
          }
  
          const updateSpace =await SpaceManagementSchema.findByIdAndUpdate(
              spaceId,
              {$set:updateData},
              {new:true,runValidators:true}
          )
  
          if(!updateSpace){
              return res.status(404).json({success:false,message:"Space not Found"});
          }
  
          return res.status(200).json({success:true,data:updateSpace,message:"space updated Successfully."})
        } catch (error) {
          console.error(error);
          return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
}



const deleteSpace = async(req,res)=>{
    try {
      const {spaceId} = req.params;
  
      if(!spaceId){
          return res.status(404).json({success:false,message:"Space Not found"});
      }
  
      const deletedSpace = await SpaceManagementSchema.findByIdAndDelete(spaceId)
  
      if(!deletedSpace){
          return res.status(500).json({success:false,message:"Something went wrong please try again"})
      }
  
      return res.status(200).json({success:true ,data:deletedSpace,message:"Space Deleted successfully !!"})
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export{getAllSpaceManagement,createSpace,viewSpace,updateSpace,deleteSpace};