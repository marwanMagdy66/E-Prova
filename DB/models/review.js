import { model, Schema ,Types} from "mongoose";

const reviewSchema=new Schema({
    comment :{type: "string", required:true},
    rating :{type: "number", min:1 , max:5,required:true},
    userId :{type:Types.ObjectId, ref: 'User', required:true},
    productId :{type:Types.ObjectId, ref: 'Product', required:true},
    //orderId :{type:Types.ObjectId, ref: 'Order'},
},
{
    timestamps: true
})


export const Review=model("Review",reviewSchema);