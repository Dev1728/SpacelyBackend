
import { SpaceManagementSchema } from "../models/space.models.js";





const getAllSpaceManagement =async (req, res) => {
    try {
      // Extract pagination and filter parameters from the query
      const { page = 1, limit = 10, activityStatus,availabilityStatus,searchKey,searchQuery } = req.query;
  
      // Convert page and limit to integers
      const pageNumber = parseInt(page);
      const pageSize = parseInt(limit);
  
      // Prepare query filters
      let query = {};
      if (activityStatus) {
        query.activityStatus = activityStatus; // Filter by activityStatus if provided
      }

      if (availabilityStatus) {
        query.availabilityStatus = availabilityStatus; // Filter by availabilityStatus if provided
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
      const space = await SpaceManagementSchema.find(query).
        populate('venueName')
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
          bookings,
          totalspace,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalBookings / pageSize),
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
        const{venueName,venueAddress,venueCapacity,price,availibility,openingTime,closingTime}= req.body;

        if(!venueName || !venueAddress || !venueCapacity || !price || !availibility || !openingTime || !closingTime){
            return res.status(404).json({success:false,message:"All fields are required"});
        }
        
    } catch (error) {
        
    }
}


export{getAllSpaceManagement};