import { Schema,Types, model } from "mongoose";

const CategorySchema=new Schema({
    name:{
        type:String,
        unique:true,
        required:true,
        min:3,
        max:20
    },
    description:{
        type:String,
        required:true,
        min:10,
        max:100
    },
    slug:{
        type:String,
        require:true,
        unique:true
    },
    image:{
        id:{type:String},
        url:{type:String}
    },

    gender:{
        type:String,
        enum:["male","female"],
        required:true
    }

},
{timestamps:true})

export const Category=model("Category",CategorySchema)