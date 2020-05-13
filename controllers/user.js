const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) return res.status(400).json({ error: "User Not Found" });
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.ency_password = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err || !user)
        return res.status(400).json({ error: "ACCESS DENIED TO UPDATE" });
      user.salt = undefined;
      user.ency_password = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.findOne({ user: req.profil._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err || !order)
        return res.status(400).json({ error: "No orders in this account" });
      res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  var purchases = [];
  req.body.orders.products.forEach((product) => {
    const { _id, desciption, name, category, quantity } = product;
    purchases.push({
      _id,
      desciption,
      name,
      category,
      quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });
  //store to db
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, user) => {
      if (err || !user)
        return res.status(400).json({ error: "Unable to save purchases" });
      next();
    }
  );
};
