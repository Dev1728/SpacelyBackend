import {Router} from 'express';
import {getAllBookingManagement,bookingStatus} from '../controllers/bookingmanagement.controller.js'

const router = Router();

router.route("/bookings").get(getAllBookingManagement);
router.route("/bookings/:bookingId").put(bookingStatus);
export default router