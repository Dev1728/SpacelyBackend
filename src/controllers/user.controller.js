
import {User} from '../models/user.models.js'


// // I have created register for simplicity
const getAllDataOfUserManagemenet = async (req,res) =>{
       
         try {
              // Extract pagination and filter parameters from the query
              const { page = 1, limit = 10, accountStatus, searchQuery, searchKey } = req.query;
          
              // Convert page and limit to integers
              const pageNumber = parseInt(page);
              const pageSize = parseInt(limit);
          
              // Prepare query filters
              let query = {};
              if (accountStatus) {
                query.accountStatus = accountStatus; // Filter by accountStatus if provided
              }
          
              if (searchQuery) {
                // Create a case-insensitive regular expression for the search
                const searchRegex = new RegExp(searchQuery, 'i');
          
                // If searchKey is provided, search only in that specific field
                if (searchKey) {
                  switch (searchKey.toLowerCase()) {
                    case 'firstname':
                      query.firstName = searchRegex;
                      break;
                    case 'lastname':
                      query.lastName = searchRegex;
                      break;
                    case 'email':
                      query["userContact.email"] = searchRegex;
                      break;
                    case 'contact':
                      query["userContact.contact"]= searchRegex;
                      break;
                    default:
                      // If searchKey is not recognized, fall back to searching all fields
                      query.$or = [
                        { firstName: searchRegex },
                        { lastName: searchRegex },
                        { 'userContact.email': searchRegex },
                        { 'userContact.contact': searchRegex }
                      ];
                  }
                } else {
                  // If no searchKey is provided, search in all fields as before
                  query.$or = [
                    { firstName: searchRegex },
                    { lastName: searchRegex },
                    { 'userContact.email': searchRegex },
                    { 'userContact.contact': searchRegex },
                  ];
                }
              }
              // Find user based on the filters
              const users = await User.find(query)
                .sort({ createdAt: -1 })
                .skip((pageNumber - 1) * pageSize) // Skip records based on page number
                .limit(pageSize); // Limit the number of records per page
          
              
              const totalUsers = await User.countDocuments(query);
          
              // Return the user with pagination data
              return res.status(200).json({
                status: true,
                message: "Users Management fetched successfully.",
                data: {
                  users,
                  totalUsers,
                  currentPage: pageNumber,
                  totalPages: Math.ceil(totalUsers / pageSize),
                  pageSize: pageSize,
                },
              });
            } catch (error) {
              console.error(error);
              res.status(500).json({
                status: false,
                message: "Error fetching admins.",
                error: error.message,
              });
            }
}



export {
    getAllDataOfUserManagemenet,
};