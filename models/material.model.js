import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  fileUrl: { type: String, required: true }, // ✅ Store Cloudinary URL
  fileId: { type: String, required: false }, // ⛔ No longer required
});

export default mongoose.models.Material || mongoose.model("Material", MaterialSchema);
