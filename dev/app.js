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

const comingData = [];

app.use(express.static("public"));
app.use(express.json({ limit: "1gb" }));
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/preText", (req, res) => {
  const data = req.body;
  comingData.push(data);
  res.send("SUCCESS");
});

app.post("/text", (req, res) => {
  const data = req.body;
  fs.writeFile("recognized.json", JSON.stringify(data), (err) =>
    console.log(err)
  );
});

app.post("/finalPost", (req, res) => {
  fs.writeFile("recognized.json", JSON.stringify(comingData), (err) =>
    console.log(err)
  );
  res.send("SUCCESS");
});

app.get("/images", (req, res) => {
  const allImagePath = getImageFilePathFromDir(
    path.join(__dirname, "public/images")
  );
  // fs.readdir(directoryPath, function (err, files) {});

  res.send(allImagePath.map((imgPath) => imgPath));
});

function getImageFilePathFromDir(dirPath) {
  const allImagePath = [];

  const files = fs.readdirSync(dirPath);

  for (file in files) {
    const fileLocation = path.join(dirPath, files[file]);
    const stat = fs.statSync(fileLocation);

    if (stat && stat.isDirectory()) {
      allImagePath.push(...getImageFilePathFromDir(fileLocation));
    } else {
      allImagePath.push(
        fileLocation.replace(
          "E:\\html projects\\Text Recoginition\\dev\\public\\images\\",
          ""
        )
      );
    }
  }

  return allImagePath;
}

const PORT = 5000;
app.listen(PORT, () => console.log("Running on Port: " + PORT));
