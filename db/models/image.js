const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true, unique: true, trim: true },
    width: { type: String, required: true, unique: true, trim: true },
    height: { type: String, required: true, trim: true },
    horizontalLines: { type: String, trim: true },
    selectedAreaNumber: { type: String, trim: true },
    verticalLines: { type: String, trim: true },
    horizontalDistances: { type: Array, trim: true },
    verticalDistances: { type: Array, trim: true },
    fileBase64: { type: String, trim: true },
  },
  { collection: "images" }
);

// ImageSchema modelini oluştur
const ImageModel = mongoose.model("Image", ImageSchema);

// ImageModel'i dışarıya aktar
module.exports = ImageModel;
