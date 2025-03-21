import {Router} from 'express';
import {getAllBookingManagement} from '../controllers/bookingmanagement.controller.js'

const router = Router();

router.route("/bookings").get(getAllBookingManagement);

export default router