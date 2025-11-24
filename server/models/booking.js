import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: String, required: true, ref: 'User' },
  // Use ObjectId for Show reference so population works correctly
  show: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Show' },
  amount: { type: Number, required: true },
  bookedSeats: { type: Array, required: true },
  isPaid: { type: Boolean, default: false },
  paymentLink: { type: String },
}, { timestamps: true })


const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;