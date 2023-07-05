import { Schema, model } from "mongoose";
const orderSchema = new Schema({
    totalPrice: { type: Number },
    // shippingPrice: { type: Number, default: 50 },
    // price: { type: Number },
    state: { type: String, enum: ['pending', 'accepted', 'shipping', 'canceled', 'done'], default: "pending" },
    location: { type: String, required: true },
    mobileNo: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cart: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        price: { type: Number }
    }]
})
// orderSchema.virtual('totalPrice').get(function () {
//     let price = 0
//     this.products.forEach(element => {
//         price=element.totalPrice
//     });
//     return price + this.shippingPrice
// })

export const orderModel = model('Order', orderSchema)