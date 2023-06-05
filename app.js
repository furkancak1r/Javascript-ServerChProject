const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
app.use(bodyParser.json({ limit: "500mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    extended: true,
    parameterLimit: 500000,
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// MongoDB Connection
const uri =
  "mongodb+srv://furkan:O6n9c2e7*@czmcluster.0h9u0ui.mongodb.net/ChProject_DB";
const dbName = "ChProject_DB";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connected to MongoDB successfully");
});

// Image Schema
const imageSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true, unique: true, trim: true },
    width: { type: String, required: true, trim: true },
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

const ImageModel = mongoose.model("Image", imageSchema);

// API endpoints
app.post("/api_chproject/post/images", async (req, res) => {
  if (!req.body.fileBase64) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const fileBase64 = req.body.fileBase64;
  const fileName = req.body.fileName;
  const filePath = path.join(__dirname, "files", fileName);

   fs.writeFile(filePath, fileBase64, { encoding: 'base64' }, async (err) => {
    if (err) {
      console.error("Error saving file:", err);
      res.status(500).json({ message: "Kaydetme hatası." });
    } else {
      console.log("File saved successfully");

      const newImage = new ImageModel({
        fileName: req.body.fileName,
        width: req.body.width,
        height: req.body.height,
        horizontalLines: req.body.horizontalLines,
        selectedAreaNumber: req.body.selectedAreaNumber,
        verticalLines: req.body.verticalLines,
        horizontalDistances: req.body.horizontalDistances,
        verticalDistances: req.body.verticalDistances,
        fileBase64: req.body.fileBase64,
      });

    /*  newImage.save((err) => {
        if (err) {
          console.error("Error saving image data:", err);
          res.status(500).json({ message: "Kaydetme hatası." });
        } else {
          console.log("Image data saved successfully");
          res.status(201).json({ message: "Dosya başarıyla yüklendi." });
        }
      });*/
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
