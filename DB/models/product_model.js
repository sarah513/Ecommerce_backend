import { Schema, model } from "mongoose";
const productSchema = new Schema({
    price:{type:Number},
    newPrice:{type:Number},
    brand:{type:String, default:""},
    isAvailable:{type:Boolean, default:true},
    prodName:{type:String , required:true},
    prodDescription:{type:String},
    sale:{type:Number, default:0},
    category:{type:String},
    images:[{type:Object}],
    isNew:{type:Boolean,default:false},
    quantity:{type:Number, default:1}
   
})
export const ProdModel = model('Product', productSchema)
