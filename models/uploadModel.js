const mongoose = require("mongoose")

const UploadSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  file: {
    data: Buffer,
    contentType: String,
  },
  uploadTime: {
    type: Date,
    default: Date.now,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
})

module.exports = Upload = mongoose.model("Upload", UploadSchema)
