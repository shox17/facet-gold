import express from "express";
const routerAdmin = express.Router();
import jewelleryShopController from "./controllers/jewellery-shop.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";

/** Restaurant */
routerAdmin.get("/", jewelleryShopController.goHome);
routerAdmin
  .get("/login", jewelleryShopController.getLogin)
  .post("/login", jewelleryShopController.processLogin);

routerAdmin.get("/signup", jewelleryShopController.getSignup).post(
  "/signup",
  makeUploader("members").single("memberImage"), // Middleware to handle file upload => req.file
  jewelleryShopController.processSignup
);

routerAdmin.get("/logout", jewelleryShopController.logout);

routerAdmin.get("/check-me", jewelleryShopController.checkAuthSession);

/** Product */
routerAdmin.get(
  "/product/all",
  jewelleryShopController.verifyJewelleryShop, // Middleware to verify Jewellery Shop  => req.member
  productController.getAllProducts
);
routerAdmin.post(
  "/product/create",
  jewelleryShopController.verifyJewelleryShop, // Middleware to verify Jewellery Shop  => req.member
  makeUploader("products").array("productImages", 5), // Middleware to handle file uploads => req.files
  productController.createNewProduct
);
routerAdmin.post(
  "/product/:id",
  jewelleryShopController.verifyJewelleryShop, // Middleware to verify Jewellery Shop  => req.member
  productController.updateChosenProduct
);

/**  User */
routerAdmin.get(
  "/user/all",
  jewelleryShopController.verifyJewelleryShop, // Middleware to verify Jewellery Shop  => req.member
  jewelleryShopController.getUsers
);
routerAdmin.post(
  "/user/edit",
  jewelleryShopController.verifyJewelleryShop, // Middleware to verify Jewellery Shop  => req.member
  jewelleryShopController.updateChosenUser
);

export default routerAdmin;
