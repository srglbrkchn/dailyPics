require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Standard server framework for nodejs
const ejs = require("ejs");
const multer = require("multer");

// Loading Image model from model.js
const imgModel = require("./model.js");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());



// Connecting to database
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function(err) {
  if (!err) {
    console.log("Connected to database");
  }
});


// Defining the storage path
// using the middleware Multer to upload in a folder called "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads")
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now())
  }
});

const upload = multer({
  storage: storage
});

// Get route
app.get("/", function(req, res){
  imgModel.find({}, function(err, items){
    if(err){
      console.log(err);
    }else {
      res.render("imagesPage", {items: items});
    }
  });
});

// Post route
app.post("/", upload.single("image"), function(req, res, next){
  const obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(path.join(__dirname+ "/uploads/" + req.file.filename)),
      contentType: "image/png"
    }
  }
  imgModel.create(obj, function(err, item) {
    if(err){
      console.log(err);
    }else{
      // item.save();
      res.redirect("/");
    }
  })
});



app.listen(process.env.PORT || 3000, function() {
  console.log('The server is up and running.');
});
