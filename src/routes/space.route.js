import {Router} from 'express';
import { createSpace, deleteSpace, getAllSpaceManagement, updateSpace, viewSpace } from '../controllers/space.controller.js';


const router =Router();


router.route("/").get(getAllSpaceManagement);
router.route("/create").post(createSpace);
router.route("/views/:spaceId").get(viewSpace);
router.route("/update/:spaceId").put(updateSpace);
router.route("/delete/:spaceId").delete(deleteSpace);

export default router;