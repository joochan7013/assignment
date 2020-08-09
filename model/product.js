const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
      type: String,
      requried: true,
      unique: true
    },
    price: {
      type: Number,
      requried: true
    },
    synopsis: {
      type: String,
      requried: true
    },
    image: {
      type: String
    },
    category: {
      type: String,
      requried: true
    },
    best: {
      type: Boolean,
      required: true
    },
    noofmeals: {
        type: Number,
        required: true
    },
    createdDate: {
      type: Date,
      default: Date.now()
    }
  });

  const productModel = mongoose.model("Product", productSchema);
  module.exports = productModel;