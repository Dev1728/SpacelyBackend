import {Router} from 'express'
import { getAllDataOfUserManagemenet } from '../controllers/user.controller.js';

const router= Router();


router.route("/getAllUserManagementData").get(getAllDataOfUserManagemenet)


export default router;



