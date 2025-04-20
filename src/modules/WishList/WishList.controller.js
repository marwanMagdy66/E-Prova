import { Product } from "../../../DB/models/Product.js";
import { WishList } from "../../../DB/models/WishList.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import mongoose from "mongoose";
export const add = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productsId } = req.body;

  // Check if product exists
  const product = await Product.findById(productsId);
  if (!product) {
    return next(new Error("Product not found"));
  }

  const newProduct = {
    product: product._id,
    addedAt: new Date(),
  };

  let wishList = await WishList.findOne({ userId });

  if (wishList) {
    const alreadyExists = wishList.products.some(
      (item) => item?.product?.toString() === newProduct.product.toString()
    );

    if (alreadyExists) {
      return next(new Error("Product already in your wish list"));
    }

    wishList.products.push(newProduct);
    await wishList.save();
  } else {
    wishList = await WishList.create({
      userId,
      products: [newProduct],
    });
  }

  return res.json({
    success: true,
    message: "Product added to wish list",
    wishList,
  });
});



export const deleteProduct = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productsId } = req.body;
  const wishList = await WishList.findOne({ userId });
  if (!wishList) {
    return next(new Error("Wish list not found", { cause: 404 }));
  }
  if (wishList.products.some((item) => item.product.toString() === productsId)) {
    wishList.products.pull({
      product: productsId,

    });
    await wishList.save();
    return res.json({
      success: true,
      message: "Product removed from wish list",
    });
  } else {
    return next(
      new Error("Product not found in your wish list", { cause: 400 })
    );
  }
});

export const deleteAllProduct = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const wishList = await WishList.findOne({ userId });
  if (!wishList) {
    return next(new Error("Wish list not found", { cause: 404 }));
  }
  wishList.products = [];
  await wishList.save();
  return res.json({
    success: true,
    message: "All products removed from wish list",
    wishList,
  });
});

export const getWishList = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const wishList =await WishList.findOne({ userId }).populate({
    path: "products.product",
    select: "name defaultImage price discount brandId category ", 
    populate: [{
      path: "brandId",
      select: "name logo", 
    },{
      path: "category",
      select: "name description gender ", 
    }],
    options: { virtuals: true }, 
  });
  if (!wishList) {
    return next(new Error("Wish list not found", { cause: 404 }));
  }
  return res.json({
    success: true,
    message: "Wish list retrieved successfully",
    wishList,
  });
});
