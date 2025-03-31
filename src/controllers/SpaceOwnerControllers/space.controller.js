import { OwnerSpaceManagementSchema } from "../../models/SpaceOwnerModels/space.models.js";



const OwnerVenueCreate = async(req,res)=>{
    try {
        const {venueName,venueAddress,price,availability,googleMapLink,venueDescription,venueBannerImage}= req.body;
    
        if(!venueName || !venueAddress || !price || !availability || !googleMapLink  || !venueDescription || !venueBannerImage){
            return res.status(404).json({success:false,message:"All fields are required"});
        }
    
        const isExistedOwnerSpace = await OwnerSpaceManagementSchema.findOne({
            $and:[{venueName},{venueAddress},{price},{googleMapLink}]
        }) 
    
        if(isExistedOwnerSpace){
            return res.status(409).json({success:false,message:"Space is already existed there"});
        }
        // Check if file exists before proceeding to upload
        const FirebaseUrl = await uploadFileMiddleware(file, "single");
    
        // Ensure FirebaseUrl is a string, not an array
        const BannerImageUrl = Array.isArray(FirebaseUrl) ? FirebaseUrl[0] : FirebaseUrl;
        
        const createSpace = await OwnerSpaceManagementSchema.create({
            venueAddress,
            venueName,
            availability,
            googleMapLink,
            venueDescription,
            venueBannerImage:BannerImageUrl ===""?"":BannerImageUrl
        })
    
    
        if(!createSpace){
            return res.status(401).json({success:false,message:"Create space Failed"});
        }
    
        const createdSpaceVenue = await OwnerSpaceManagementSchema.findById(createSpace._id);
    
        if(!createdSpaceVenue){
            return res.status(500).json({success:false,message:"Something went wrong with create space venue"});
        }
        return res.status(201).json({success:true,data:createSpace,message:"Space venue created successfully !!"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Internal server error"});
    }
}

const updateSpaceVenue = async(req,res)=>{
    try {
        const {venueId} = req.params;
        if(!venueId){
            return res.status(401).json({success:false,message:"venueID is required"});
        }
    
        const updateData = req.body;
    
        if(!Object.keys(updateData).length === 0){
            return res.status(400).json({success:false,message:"Atleast one field is required to update venue"});
        }
    
        const updatedSpaceVenue = await  OwnerSpaceManagementSchema.findByIdAndUpdate(
            venueId,
            {$set:updateData},
            {new:true,runValidators:true}
        )
    
        if(!updatedSpaceVenue){
            return res.status(404).json({success:false,message:"space venue not Found "});
        }
    
        return res.status(200).json({success:true,data:updatedSpaceVenue,message:"space venue updated successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Internal server error"});
    }

}

export {OwnerVenueCreate,updateSpaceVenue}