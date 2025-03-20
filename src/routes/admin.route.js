import {Router} from 'express';
import { register,login,getAdmin } from '../controllers/admin.controller.js';
const router= Router();

router.route('/admins').get(getAdmin);
router.route('/register').post(register);
router.route('/login').post(login)

export default router;