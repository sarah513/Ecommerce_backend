import { Router } from "express";
import { addOrder, updateOrder ,getOrders, getOrderByState, deleteOrder,  deleteAllOrdersAlsoForUser } from "./controller/controller.js";
const router = Router()
// add order
router.post('/add/:id',addOrder)
//update order
router.patch('/update/:id',updateOrder)
//get orders
router.get('/all',getOrders)
router.delete('/dltall/:id',deleteAllOrdersAlsoForUser)
//filter
router.get('/by',getOrderByState)

//dlt
router.get('/dlt/:id',deleteOrder)
export default router
