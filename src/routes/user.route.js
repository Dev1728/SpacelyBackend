import {Router} from 'express'
import { getAllDataOfUserManagemenet } from '../controllers/user.controller.js';

const router= Router();


router.route("/getAllUserManagementData").post(getAllDataOfUserManagemenet)


export default router;



