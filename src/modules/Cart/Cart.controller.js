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

  const finalPrice = product.finalPrice; // استخدام الفاينال برايس

  if (!product.inStock(quantity)) {
    return next(
      new Error(`Sorry, only ${product.stock} items are available`, {
        cause: 400,
      })
    );
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

      isProductInCart.totalPrice += finalPrice * quantity;

      product.stock -= quantity;

      await product.save();
      await isProductInCart.save();

      return res.json({ success: true, message: "Product added to cart" });
    } else {
      return next(
        new Error(`Sorry, only ${product.stock} items are available`, {
          cause: 400,
        })
      );
    }
  }

  const totalPrice = finalPrice * quantity;
  product.stock -= quantity;
  await product.save();

  const cart = await Cart.findOneAndUpdate(
    { userId },
    {
      $push: {
        products: { productId, quantity },
      },
      $set: { totalPrice },
    },
    { new: true, upsert: true }
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
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(new Error("Cart not found", { cause: 404 }));
  }

  const productInCart = cart.products.find(
    (p) => p.productId.toString() === productId
  );
  if (!productInCart) {
    return next(new Error("Product not found in cart", { cause: 404 }));
  }

  const oldQuantity = productInCart.quantity;
  const quantityDifference = quantity - oldQuantity;

  // تحقق من توفر الكمية لو المستخدم زوّد الطلب
  if (quantityDifference > 0) {
    if (product.stock < quantityDifference) {
      return next(
        new Error(`Sorry, only ${product.stock} items are available`, {
          cause: 400,
        })
      );
    }
    product.stock -= quantityDifference;
  } else if (quantityDifference < 0) {
    product.stock += Math.abs(quantityDifference);
  }

  await product.save();

  productInCart.quantity = quantity;
  cart.totalPrice = product.price * quantity;
  await cart.save();

  res.json({
    success: true,
    message: "Cart updated and stock adjusted",
    cart,
  });
});

export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(new Error("Cart not found", { cause: 404 }));
  }

  const productInCart = cart.products.find(
    (p) => p.productId.toString() === productId
  );

  if (!productInCart) {
    return next(new Error("Product not found in cart", { cause: 404 }));
  }

  const quantityToReturn = productInCart.quantity;
  const totalPriceToReturn = product.price * quantityToReturn;
  cart.totalPrice -= totalPriceToReturn;

  product.stock += quantityToReturn;
  await product.save();

  const updatedCart = await Cart.findOneAndUpdate(
    {
      userId,
    },
    {
      $pull: { products: { productId } },
      $set: { totalPrice: cart.totalPrice },
    },
    {
      new: true,
    }
  );

  res.json({
    success: true,
    message: "Product removed from cart and quantity returned to stock",
    cart: updatedCart,
  });
});

export const clearCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(new Error("Cart not found", { cause: 404 }));
  }

  for (const item of cart.products) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }
  cart.products = [];
  cart.totalPrice = 0;
  await cart.save();

  res.json({ success: true, message: "Cart cleared" });
});
