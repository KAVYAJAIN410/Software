const mongoose = require("mongoose");
const { type } = require("os");
const { Schema, Types } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: false,
    },
    mobNo: {
      type: Number,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    CourseId: [
      {
        type: Types.ObjectId,
        ref: "courses", 
      },
    ],
    isTeacher:{
      type:Boolean,
      default:false
    }
  },
  { collection: "Users" }
);

const Users = mongoose.models.Users || mongoose.model("Users", userSchema);

module.exports = Users;
