import { Product } from "../../../DB/models/Product.js";
import { WishList } from "../../../DB/models/WishList.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const add = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);
  const { productsId } = req.body;

  const product = await Product.findById(productsId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  const wishList = await WishList.findOne({ userId });

  if (wishList) {
    if (wishList.products.some((id) => id.toString() === productsId)) {
      return next(
        new Error("Product already in your wish list", { cause: 400 })
      );
    }

    wishList.products.push(productsId);
    await wishList.save();
    return res.json({
      success: true,
      message: "Product added to wish list",
      wishList,
    });
  } else {
    const wishList = await WishList.create({
      userId,
      products:productsId,
    });
    return res.json({
      success: true,
      message: "Product added to wish list",
      wishList,
    });
  }
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productsId } = req.body;
  const wishList = await WishList.findOne({ userId });
  if (!wishList) {
    return next(new Error("Wish list not found", { cause: 404 }));
  }
  if (wishList.products.some((id) => id.toString() == productsId)) {
    wishList.products.pull(productsId);
    await wishList.save();
    return res.json({
      success: true,
      message: "Product removed from wish list",
      wishList,
    });
  }else{
    return next(new Error("Product not found in your wish list", { cause: 400 }))
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
  const wishList = await WishList.findOne({ userId }).populate(
    "products",
    "name price defaultImage"
  );
  if (!wishList) {
    return next(new Error("Wish list not found", { cause: 404 }));
  }
  return res.json({
    success: true,
    message: "Wish list retrieved successfully",
    wishList,
  });
});
