import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BookingManagement } from "../models/bookingManagement.models.js";
import mongoose from 'mongoose';


const getAllBookingManagement =async (req, res) => {
    try {
      // Extract pagination and filter parameters from the query
      const { page = 1, limit = 10, bookingStatus,paymentStatus, bookingType,cancellationStatus ,searchKey,searchQuery } = req.query;
  
      // Convert page and limit to integers
      const pageNumber = parseInt(page);
      const pageSize = parseInt(limit);
  
      // Prepare query filters
      let query = {};
      if (bookingStatus) {
        query.bookingStatus = bookingStatus; // Filter by bookingStatus if provided
      }

      if (paymentStatus) {
        query.paymentStatus = paymentStatus; // Filter by PaymentStatus if provided
      }
      if (bookingType) {
        query.bookingType = bookingType; // Filter by PaymentStatus if provided
      }
      if (cancellationStatus) {
        query["cancellationStatus.status"] = cancellationStatus; // Filter by PaymentStatus if provided
      }
  
      if (searchQuery) {
        // Create a case-insensitive regular expression for the search
        const searchRegex = new RegExp(searchQuery, 'i');
  
        // If searchKey is provided, search only in that specific field
        if (searchKey) {
          switch (searchKey.toLowerCase()) {
            case 'username':
              query.userName = searchRegex;
              break;
            case 'email':
              query["userContact.email"] = searchRegex;
              break;
            case 'contact':
              query["userContact.contact"]= searchRegex;
              break;
            case 'venue':
              query.venueName = searchRegex;
              break;
            default:
              // If searchKey is not recognized, fall back to searching all fields
              query.$or = [
                { username: searchRegex },
                { 'userContact.email': searchRegex },
                { 'userContact.contact': searchRegex },
                { venueName: searchRegex }
              ];
          }
        } else {
          // If no searchKey is provided, search in all fields as before
          query.$or = [
            { username: searchRegex },
            { 'userContact.email': searchRegex },
            { 'userContact.contact': searchRegex },
            { venueName: searchRegex }
          ];
        }
      }
      // Find admins based on the filters
      const bookings = await BookingManagement.find(query).
        populate('bookingStatus')
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize) // Skip records based on page number
        .limit(pageSize); // Limit the number of records per page
  
      // Get total count of admins for pagination
      const totalBookings = await BookingManagement.countDocuments(query);
  
      // Return the admins with pagination data
      return res.status(200).json({
        status: true,
        message: "Bookings fetched successfully.",
        data: {
          bookings,
          totalBookings,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalBookings / pageSize),
          pageSize: pageSize,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Error fetching bookings.",
        error: error.message,
      });
    }
}

const bookingStatus = asyncHandler(async (req, res) => {
  const { bookingStatus } = req.body;
  const { bookingId } = req.params;

  // Validate status input
  if (!bookingStatus || !["pending", "confirmed", "completed", "cancelled"].includes(bookingStatus)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
  }

  console.log("Received bookingId:", bookingId);
  
  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ success: false, message: "Invalid booking ID format" });
  }

  // Find and update booking
  const booking = await BookingManagement.findByIdAndUpdate(
    bookingId,
    { $set: { bookingStatus } },  
    { new: true, runValidators: true }
  );

  if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
  }

  return res.status(200).json({ success: true, data: booking, message: "Booking status updated successfully" });
});

export{getAllBookingManagement,bookingStatus};