import { Router } from "express";
import { OwnerVenueCreate, updateSpaceVenue } from "../../controllers/SpaceOwnerControllers/space.controller.js";
import {uploadSingle,uploadMultiple} from '../../middlewear/multer.middlewear.js'
const router = Router();


router.route('/create').post(uploadSingle,OwnerVenueCreate);
router.route('/update').put(updateSpaceVenue);

export default router;