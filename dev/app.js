const express = require("express"),
  app = express(),
  fs = require("fs"),
  path = require("path"),
  multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "save");
  },
  filename: (req, res, cb) => {
    cb(null, req.filename);
  },
});

const saveData = multer({ storage }).single("imgToText");

app.set("view engine", "ejs");
app.use(express.static("images"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/images", (req, res) => {
  const directoryPath = path.join(__dirname, "images");
  const AllImages = [];
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    files.forEach(function (img) {
      AllImages.push(img);
    });
    res.send(AllImages);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log("Running on Port: " + PORT));
