const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const assert = require("assert");

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

  const bucket = new mongodb.GridFSBucket(connection.db, {
    bucketName: "images",
  });

  const uploadStream = bucket.openUploadStream(fileName);
  const buffer = Buffer.from(fileBase64, "base64");

  uploadStream.end(buffer);

  uploadStream
    .on("error", function (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Dosya yükleme hatası." });
    })
    .on("finish", async function () {
      console.log("Dosya yüklendi!");
      res.send("Dosya yüklendi!");

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

      await ImageModel.deleteMany({ fileName: fileName });

      await newImage.save();
    });
});

// GET endpoint to retrieve data without files
app.get("/api_chproject/get/data", async (req, res) => {
  try {
    const data = await ImageModel.find({}, { fileBase64: 0 }); // Exclude the fileBase64 field

    res.json(data);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ message: "Error retrieving data" });
  }
});
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
