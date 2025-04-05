import {Schema ,Types ,model} from "mongoose"

const OrdersSchema =new Schema({
    customerId : {type:Types.ObjectId, ref :"User" ,required: true},
    phone:{type:String ,required:true},
    products:[{
        name:{type:String ,required:true},
        productId:{type:Types.ObjectId, ref:"Product"},
        quantity:{type:Number,min:1,required: true},
        priceAtPurchase :{type:Number,required: true},
        totalPrice: { type:Number, required: true }
    }],
    totalOrderPrice: {type:Number },
    status: {type:String, default:"pending" ,enum: ["pending", "shipped","cancelled", "delivered"]},
    shippingAddress:{type:String, required:true},
    paymentMethod:{type:String,default:"cash", enum:["cash", "visa"]},

},{
    timestamps:true,
})  

export const Order=model("Order",OrdersSchema)