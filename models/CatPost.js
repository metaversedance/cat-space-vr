var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;
var CatPostSchema = new Schema({
  title: {
    type: String
  },
  link: {
    type: String
  },
  imgSrc: {
    type: String
  },
  position: {
    x: {
      type: Number,
      max: 20
    },
    y: {
      type: Number,
      max: 20
    },
    z: {
      type: Number,
      max: 20
    }
  },
  rotation: {
    x: {
      type: Number,
      max: 20
    },
    y: {
      type: Number,
      max: 20
    },
    z: {
      type: Number,
      max: 20
    }
  },
  scale: {
    x: {
      type: Number
    },
    y: {
      type: Number
    },
    z: {
      type: Number
    }
  }
});

// This creates our model from the above schema, using mongoose's model method
var CatPost = mongoose.model("CatPost", CatPostSchema);

// Export the Article model
module.exports = CatPost;
