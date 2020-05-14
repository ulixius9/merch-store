const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category)
      return res.status(400).json({ error: "Category Not Found " });
    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err || !category)
      return res.status(400).json({ error: "Please enter category name" });
    res.json(category);
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories)
      return res.status(400).json({ error: "No category Found" });
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  let category = req.category;
  category.name = req.body.name;
  category.save((err, category) => {
    if (err || !category)
      return res.status(400).json({ error: "Can not update category" });
    res.json(category);
  });
};

exports.removeCategory = (req, res) => {
  let category = req.category;
  category.remove((err, category) => {
    if (err || !category)
      return res.status(400).json({ error: "unable to delete" });
    res.json({ msg: `${category.name} deleted successfully` });
  });
};
