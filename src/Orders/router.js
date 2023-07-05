import { Router } from "express";
import { addOrder, updateOrder } from "./controller/controller.js";
const router = Router()
// add order
router.post('/add/:id',addOrder)
//update order
router.patch('/update/:id',updateOrder)
export default router