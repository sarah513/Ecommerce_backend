import { Schema, model } from "mongoose";
const productSchema = new Schema({
    price:{type:Number},
    newPrice:{type:Number},
    isAvailable:{type:Boolean, default:true},
    prodName:{type:String , required:true},
    prodDescription:{type:String},
    sale:{type:Number, default:0},
    category:{type:String},
    images:[{type:Object}],
   
})
export const ProdModel = model('Product', productSchema)