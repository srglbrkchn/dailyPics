// Server logic
// Create a mongoose schema to save and retrieve the image

const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  name: String,
  desc: String,
  img: {
    // Our datatype for image is Buffer which allows us to store our image as data in the form of arrays.
    data: Buffer,
    contentType: String
  }
});

// Image is a model of imageSchema
module.exports = new mongoose.model("Image", imageSchema);
