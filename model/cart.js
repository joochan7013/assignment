const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartSchema = new Schema({
  userId: {
    type: String,
    requried: true
  },
  prodId:{
    type: String,
    required:true
  },
  title: {
    type: String,
    requried: true
  },
  synopsis: {
    type: String,
    requried: true
  },
  image: {
    type: String,
    requried: true
  },
  noofmeals: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    require: true
  },
  createdDate: {
    type: Date,
    default: Date.now()
  }
});


const cartModel = mongoose.model("Cart", cartSchema);
module.exports = cartModel;