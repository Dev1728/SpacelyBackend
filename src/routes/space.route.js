import {Router} from 'express';
import { getAllSpaceManagement } from '../controllers/space.controller.js';


const router =Router();


router.route("/getAllSpaceDashBoard").get(getAllSpaceManagement)