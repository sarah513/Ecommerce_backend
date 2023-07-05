import { Router } from "express";
import { fileUpload } from "../../utils/cloudMulter.js";

import { addImageForProduct, addProduct, deleteImageOfProduct, dltProduct, getAllProducts, getProductById, searchByName, updateProduct } from "./controller/controller.js";
const router = Router()

//get all products with filter if needed
router.get('/all',getAllProducts)

//get product by id 
router.get('/:id',getProductById)

//add product
router.post('/add',fileUpload(['image/png','image/jpeg','image/jpg']).array('images'),addProduct)

//delete product
router.delete('/dlt/:id',dltProduct)

// update all product info except images
router.put('/update/:id',updateProduct)

//search in data
router.get('/search/:name',searchByName)

//delete image in exist product
router.patch('/dltimg/:id',deleteImageOfProduct)

//add image for exist product
router.patch('/addimg/:id',fileUpload(['image/png','image/jpeg','image/jpg']).array('images'),addImageForProduct)

export default router