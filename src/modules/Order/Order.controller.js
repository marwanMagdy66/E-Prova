import Stripe from "stripe";
import { Cart } from "../../../DB/models/Cart.js";
import { Order } from "../../../DB/models/Order.js";
import { Product } from "../../../DB/models/Product.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


export const createOrder = asyncHandler(async (req, res, next) => {
    const { payment, phone, shippingAddress } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if(!cart) return next(new Error("the cart not found", { cause: 404 }));

    const Products = cart?.products || [];

    if (Products.length < 1)
        return res.status(400).json({ message: "Cart is empty" });

    let orderproducts = [];
    let totalOrderPrice = 0;

    for (let i = 0; i < Products.length; i++) {
        const product = await Product.findById(Products[i].productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (!product.inStock(Products[i].quantity)) {
            return next(new Error(`Product out of stock ,${product.stock} are availabe`))
        }
        orderproducts.push({
            name: product.name,
            productId: product._id,
            quantity: Products[i].quantity,
            priceAtPurchase: product.finalPrice,
            totalPrice: product.finalPrice * Products[i].quantity,

        })
        totalOrderPrice += product.finalPrice * Products[i].quantity;

    }

    const order = await Order.create({
        customerId: req.user._id,
        paymentMethod: payment,
        phone: phone,
        shippingAddress: shippingAddress,
        products: orderproducts,
        totalOrderPrice: totalOrderPrice,
    })


    const updateStock = async (products) => {
        const bulkUpdateOperations = products.map((item) => ({
            updateOne: {
                filter: { _id: item.productId },
                update: { $inc: { stock: -item.quantity } }
            }
        }));
        await Product.bulkWrite(bulkUpdateOperations);
    };

    await updateStock(orderproducts);

    let sessionUrl=null;
    
    if(payment === "visa"){
        const stripe=new Stripe(process.env.STRIPE_KEY)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: "https://e-prova-ten.vercel.app/e-prova/order/success",
            cancel_url: "https://e-prova-ten.vercel.app/e-prova/order/faild",
            line_items: orderproducts.map((product) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                    name: product.name,
                },
                  unit_amount: Math.round(product.priceAtPurchase * 100),
                },
                quantity: product.quantity,
            };
            }),
        });
        sessionUrl = session.url;
    }
    
    

    const clearCart = async (userId) => {
        await Cart.findOneAndUpdate({ userId }, { $set: { products: [] } });
    };
    await clearCart(req.user._id);



    return res.json({ success: true, message: "Order created successfully", data: order , paymentUrl:sessionUrl })

})

export const cancelledOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return next(new Error("order not found", { cause: 404 }))

    if (order.customerId.toString() !== req.user._id.toString()) {
        return next(new Error("You are not allowed to cancel this order"));
    }

    if (order.status !== "pending") {
        return next(new Error("Only pending orders can be cancelled"));
    }

    order.status = "cancelled";

    await Product.bulkWrite(order.products.map((item) => ({
        updateOne: {
            filter: { _id: item.productId },
            update: { $inc: { stock: item.quantity } }
        }
    })));

    await order.save();
    return res.json({ success: true, message: "Order cancelled successfully" })

})

export const getOrders = asyncHandler(async (req, res, next) => {
    let orders;

    if (req.user.role === "admin") {
        orders = await Order.find().populate("customerId", "username email").populate("products.productId", "name price");;
    }
    else if (req.user.role === "customer") 
        { 
            orders = await Order.find({ customerId: req.user._id }).populate("products.productId", "name price"); 
        }
    else {
        return next(new Error("Unauthorized access", { cause: 403 }));
    }

    return res.json({ success: true, data: orders })
})


