import { orderModel } from "../../../DB/models/order_model.js";
import { ErrorHandler } from "../../../utils/ErrHandler.js";
import { doneResponse } from "../../../utils/done.js";
import { userModel } from "../../../DB/models/user_model.js"

export const addOrder = ErrorHandler(
    async (req, res, next) => {
        let { id } = req.params
        let { cart, mobileNo, location } = req.body
        let price = 0
        console.log(cart)
        cart.map(ele => {
            price += (ele.quantity * ele.newPrice)
        })
        console.log(price)

        let done = await orderModel.create({
            user: id,
            cart,
            mobileNo, location, totalPrice: price

        })
        console.log(done._id)
        if (done) {
            let user = await userModel.findById(id)
            let { orders } = user
            let newOrders = [...orders]
            console.log(newOrders)
            newOrders.push(done._id)
            console.log(newOrders)
            let done2 = await userModel.findByIdAndUpdate(id, { orders: newOrders }, { new: true })
            done2 ? doneResponse(res, done2) : next("Error in adding order to user")
        } else {
            next(new Error("Error in adding order"))
        }
        // let done0=await userModel.findById(id)
        // let {orders}=done0
        // console.log(orders)
        // let newOrder=[...orders]
        // done ? doneResponse(res, done) : next(new Error("Error in adding order"))
    }
)

export const updateOrder = ErrorHandler(
    async (req, res, next) => {
        let { id } = req.params
        console.log(req.body)
        let done = await orderModel.findByIdAndUpdate(id, req.body, { new: true })
        done ? doneResponse(res, done) : next(new Error("error in updating order "))
    }
)
