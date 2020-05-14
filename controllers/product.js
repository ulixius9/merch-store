const Product = require("../models/product");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
// const { validationResult } = require("express-validator");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product)
        return res.status(404).json({ error: "Product not found " });
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  //verify fields
  //   const errors = validationResult(req);
  //   console.log(req.body);
  //   if (!errors.isEmpty()) return res.status(400).json(errors);
  //handle formdata
  const form = formidable({ keepExtensions: true });
  form.parse(req, (err, fields, file) => {
    if (err) return res.status(400).json({ error: "faild to create product" });
    const product = new Product(fields);
    if (file.photo) {
      // Verify image
      if (file.photo.type.split("/")[0] != "image")
        return res.status(400).json({ error: "Please Upload Valid Image" });
      if (file.photo.size > 3 * 1024 * 1024)
        return res
          .status(400)
          .json({ error: "Image should be less then 3 MB" });

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.mimetype;
      console.log(product);

      //Save to DB
      product.save((err, product) => {
        if (err) {
          return res.status(400).json({ error: "unable to store in DB" });
        }
        res.json(product);
      });
    }
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  res.json(req.product);
};

exports.getProductPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    res.send(req.product.photo.data);
  }
};

exports.getAllProducts = (req, res) => {
  let limit = parseInt(req.query.limit) | 8;
  let sort = req.query.sort | "_id";
  Product.find()
    .select("-photo")
    .limit(limit)
    .populate("category")
    .sort([[sort, "asc"]])
    .exec((err, products) => {
      if (err || !products)
        return res.status(404).json({ error: "No Product Found" });
      res.json(products);
    });
};

exports.updateProduct = (req, res) => {
  //verify fields
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) return res.status(400).json(errors);
  //handle formdata
  const form = formidable({ keepExtensions: true });
  form.parse(req, (err, fields, file) => {
    if (err) return res.status(400).json({ error: "faild to update product" });
    let product = req.product;
    product = _.extend(product, fields);
    if (file.photo) {
      // Verify image
      if (file.photo.type.split("/")[0] != "image")
        return res.status(400).json({ error: "Please Upload Valid Image" });
      if (file.photo.size > 3 * 1024 * 1024)
        return res
          .status(400)
          .json({ error: "Image should be less then 3 MB" });

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.mimetype;
    }
    console.log(product);
    //Save to DB
    product.save((err, product) => {
      if (err) return res.status(400).json({ error: "unable to update in DB" });
      res.json(product);
    });
  });
};

exports.removeProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err)
      return res.status(400).json({ error: "Unable to delete product " });
    res.json({
      msg: "deleted Successfully",
      product: deletedProduct,
    });
  });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found",
      });
    }
    res.json(category);
  });
};

//middleware
exports.updateStock = (req, res, next) => {
  let operations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });
  Product.bulkWrite(operations, (error, products) => {
    if (err) return res.status(400).json({ error: "unable to update stock" });
    next();
  });
};
