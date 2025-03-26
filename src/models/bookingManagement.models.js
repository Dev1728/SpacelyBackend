import mongoose from 'mongoose';

const bookingManagementSchema = new mongoose.Schema(
    {
        bookingId: {
            type:String,
            unique: true,
            required: true,
            trim: true
        },
        username: {
            type: String,
            required: true,
        },
        userContact: {
            email: {
                type: String,
                required: true
            },
            contact: {
                type: Number,
                required: true
            }
        },
        venueName: {
            type: String,
            required: true,
            trim: true
        },
        venueAddress: {
            type: String,
            required: true
        },
        venueId: {
            type: String,
            required: true
        },
        bookingDateAndTime: {
            type: Date,
            default: Date.now
        },
        eventDateAndTime: {
            start: {
                type: Date
            },
            end: {
                type: Date
            }
        },
        duration: {
            type: String
        },
        guest: {
            type: Number,
            required: true
        },
        bookingStatus: {
            type:String,
            enum:["pending","confirmed","completed","cancelled"],
            required: true,
            default:"pending"
        },
        paymentStatus: {
            type: String,
            enum: ["Paid", "Partially Paid", "Unpaid", "Refunded"],
            default: "Unpaid"
        },
        bookingType: {
            type: String,
            required: true
        },
        cancellationStatus: {
            status: {
                type: String,
                enum: ["Allowed", "Not Allowed"],
                default: "Not Allowed"
            },
            cancellationDate: {
                type: Date,
                validate: {
                    validator: function (value) {
                        return this.cancellationStatus.status === "Allowed" ? !!value : !value;
                    },
                    message: "Cancellation date must be provided if status is 'Allowed', and should not be provided otherwise."
                }
            }
        }
    },
    { timestamps: true }
);

export const BookingManagement = mongoose.model("BookingManagement", bookingManagementSchema);
