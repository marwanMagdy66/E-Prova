import { Cart } from "../../../DB/models/Cart.js";
import { Product } from "../../../DB/models/Product.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addToCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }
  if (!product.inStock(quantity)) {
    return next(new Error(`sorry, only ${product.stock}  items are availabel`));
  }
  const isProductInCart = await Cart.findOne({
    userId,
    "products.productId": productId,
  });
  if (isProductInCart) {
    const theProduct = isProductInCart.products.find(
      (product) => product.productId.toString() === productId.toString()
    );
    if (product.inStock(theProduct.quantity + quantity)) {
      theProduct.quantity += quantity;
      await isProductInCart.save();
      return res.json({ message: "Product added to cart" });
    } else {
      return next(
        new Error(`sorry, only ${product.stock}  items are availabel`)
      );
    }
  }
  const cart = await Cart.findOneAndUpdate(
    {
      userId,
    },
    {
      $push: { products: { productId, quantity } },
    },
    {
      new: true,
    }
  );
  res.json({ success: true, message: "Product added to cart", cart });
});

export const getCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  if (req.user.role == "customer") {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    res.json({ success: true, message: "cart retrieved", cart });
  }
  if (req.user.role == "admin" && !req.body.cartId) {
    return next(new Error("cartId is required", { cause: 400 }));
  }
  const cart = await Cart.findById(req.body.cartId).populate(
    "products.productId"
  );
  return res.json({
    success: true,
    cart: cart,
  });
});

export const updateCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }
  if (!product.inStock(quantity)) {
    return next(
      new Error(`Sorry, only ${product.stock} items are available`, {
        cause: 400,
      })
    );
  }

  const cart = await Cart.findOneAndUpdate(
    {
      userId,
      "products.productId": productId,
    },
    {
      "products.$.quantity": quantity,
    },
    {
      new: true,
    }
  );
  if (!cart) {
    return next(new Error("the product not found in cart", { cause: 404 }));
  }
  res.json({ success: true, message: "Cart updated", cart });
});

export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user._id;
  const cart = await Cart.findOneAndUpdate(
    {
      userId,
    },
    {
      $pull: { products: { productId } },
    },
    {
      new: true,
    }
  );
  if (!cart) {
    return next(new Error("the product not found in cart", { cause: 404 }));
  }
  res.json({ success: true, message: "Product removed from cart", cart });
});

export const clearCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { $set: { products: [] } }
  );
  res.json({ success: true, message: "Cart cleared" });
});
