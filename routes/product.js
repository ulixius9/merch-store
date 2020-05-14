const express = require("express");
const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const {
  getProductById,
  createProduct,
  getProduct,
  getProductPhoto,
  getAllProducts,
  updateProduct,
  removeProduct,
} = require("../controllers/product");
// const { check } = require("express-validator");

const router = express.Router();

//params
router.param("productId", getProductById);
router.param("userId", getUserById);
//Routes

//create
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  //   [
  //     check("name", "Name should be min 2 char long").isLength({ min: 2 }),
  //     check("description", "Please Add Description").isLength({ min: 1 }),
  //     check("category", "Please Add Category").isLength({ min: 1 }),
  //     check("price", "Please Add Description").isNumeric(),
  //     check("stock", "Please Add Stock").isInt(),
  //   ],
  createProduct
);

//read
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", getProductPhoto);
router.get("/products", getAllProducts);

//update
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  //   [
  //     check("name", "Name should be min 2 char long").isLength({ min: 2 }),
  //     check("description", "Please Add Description").isLength({ min: 1 }),
  //     check("category", "Please Add Category").isLength({ min: 1 }),
  //     check("price", "Please Add Description").isNumeric(),
  //     check("stock", "Please Add Stock").isNumeric(),
  //   ],
  updateProduct
);

//delete
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeProduct
);

module.exports = router;
