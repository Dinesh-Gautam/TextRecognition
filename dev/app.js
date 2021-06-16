const express = require("express"),
  app = express(),
  fs = require("fs"),
  path = require("path"),
  multer = require("multer");

// const storage = multer.diskStorage({
//   destination: (req, res, cb) => {
//     cb(null, "save");
//   },
//   filename: (req, res, cb) => {
//     cb(null, req.filename);
//   },
// });

// const saveData = multer({ storage }).single("imgToText");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/images", (req, res) => {
  const directoryPath = path.join(__dirname, "public/images");
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    res.send(files.map((img) => img));
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log("Running on Port: " + PORT));