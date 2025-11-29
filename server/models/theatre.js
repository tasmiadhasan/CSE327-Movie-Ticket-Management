import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    amenities: { type: [String], default: [] },
  },
  { timestamps: true }
)

const Theatre = mongoose.model('Theatre', theatreSchema)
export default Theatre;
