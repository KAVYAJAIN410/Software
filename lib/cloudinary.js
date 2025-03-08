import { v2 as cloudinary } from "cloudinary";

cloudinary.config(); // Uses CLOUDINARY_URL from .env.local

export default cloudinary;
