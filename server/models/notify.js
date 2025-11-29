import mongoose from "mongoose";

const notifySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    movieId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

notifySchema.index({ userId: 1, movieId: 1 }, { unique: true });

const Notify = mongoose.model("Notify", notifySchema);

export default Notify;
