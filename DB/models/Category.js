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

    gender:{
        type:String,
        enum:["male","female"],
        required:true
    }

},
{timestamps:true})

export const Category=model("Category",CategorySchema)

CategorySchema.index({ name: 1, gender: 1 }, { unique: true });
