import mongoose, { Schema } from "mongoose";
import {
  ProductCollection,
  ProductSize,
  ProductStatus,
  ProductWeightGram,
} from "../libs/enums/product.enum";

const productSchema = new Schema(
  {
    productStatus: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.PAUSE,
    },
    productCollection: {
      type: String,
      enum: Object.values(ProductCollection),
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    // jewellery stock
    productLeftCount: {
      type: Number,
      required: true,
    },
    // US ring sizes: US_4, US_4.5, US_5, etc.
    productSize: {
      type: String,
      enum: Object.values(ProductSize),
      default: "US_6",
    },
    // gram weight for jewellery
    productVolume: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 30, 50],
      default: 5,
    },
    productDesc: {
      type: String,
    },
    productImages: {
      type: [String],
      default: [],
    },
    productViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // createdAt and updatedAt
);

// Ensures a unique combination of productName, productSize, and productVolume
productSchema.index(
  { productName: 1, productSize: 1, productVolume: 1 },
  { unique: true }
);

export default mongoose.model("Product", productSchema);
