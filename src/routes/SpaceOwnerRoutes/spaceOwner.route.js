import {Router} from 'express'
import { createProfile, login, verifyOTP } from '../../controllers/SpaceOwnerControllers/spaceOwner.controller.js';
import { uploadSingle } from '../../middlewear/multer.middlewear.js';


const router = Router();

router.route('/createprofile').post(uploadSingle,createProfile);
router.route('/login').post(login);
router.route('/verifyotp').post(verifyOTP);

export default router