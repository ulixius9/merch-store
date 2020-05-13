const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productCartSchema = mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product",
  },
  name: String,
  count: Number,
  price: Number,
});

const productCart = mongoose.model("ProductCart", productCartSchema);

const orderShema = mongoose.Schema(
  {
    products: [productCartSchema],
    transaction_id: String,
    amount: Number,
    update: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
    address: String,
  },
  {
    timestamps: true,
  }
);

const order = mongoose.model("Order", orderShema);

module.exports = {
  order,
  productCart,
};
