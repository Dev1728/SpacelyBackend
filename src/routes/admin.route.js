import {Router} from 'express';
import {login,viewAdmin,updateAdmin, deleteAdmin, getAllAdminDashboards, createAdmin,ForgotPassword,verifyOTP,resetPassWord } from '../controllers/admin.controller.js';
const router= Router();


router.route('/createAdmin').post(createAdmin);
router.route('/login').post(login)

router.route('/allAdmins').get(getAllAdminDashboards)
router.route('/view/:adminId').get(viewAdmin);
router.route("/update/:adminId").put(updateAdmin);
router.route("/delete/:adminId").delete(deleteAdmin);


router.route("/forgotpassword").post(ForgotPassword);
router.route("/verifyotp").post(verifyOTP);
router.route("/resetpassword").post(resetPassWord);

export default router;