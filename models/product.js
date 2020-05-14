const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlenght: 32,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlenght: 2000,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    price: {
      type: Number,
      trim: true,
      maxlenght: 32,
      required: true,
    },
    stock: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
