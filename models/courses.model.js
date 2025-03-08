const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const userSchema = new Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    Syllabus: {
      type: Number,
      required: false,
    },
    Duration: {
      type: Number,
      required: false,
    }
  },
  { collection: "Courses" }
);

const Courses = mongoose.models.Courses || mongoose.model("Courses", courseSchema);

export default Courses;
