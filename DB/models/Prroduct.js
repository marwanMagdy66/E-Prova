const productSchema=new schema({
    name:{type:string, required:true},
    description:{
        type:string, required:true
    },
    price:{
        type:string, required:true
    },
    image:{
        id:{type:String},
        url:{type:String}
    },
    category:{
        type:Types.ObjectId, 
        ref:"Category",
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        default:0,
    },
    brandId:{type:Types.ObjectId,ref:"Brand"},
    types

})