import { Router } from "express";
import { addOrder, updateOrder ,getOrders, getOrderByState, deleteOrder } from "./controller/controller.js";
const router = Router()
// add order
router.post('/add/:id',addOrder)
//update order
router.patch('/update/:id',updateOrder)
//get orders
router.get('/all',getOrders)

//filter
router.get('/by',getOrderByState)

//dlt
router.get('/dlt/:id',deleteOrder)
export default router
