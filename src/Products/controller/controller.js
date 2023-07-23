import cloudinary from "../../../utils/cloudinary.js";
import { ProdModel } from "../../../DB/models/product_model.js";
import { ErrorHandler } from "../../../utils/ErrHandler.js";
import { doneResponse } from "../../../utils/done.js";

import algoliasearch from "algoliasearch";

export const addProduct = ErrorHandler(async (req, res, next) => {
    let arr = []
    let { prodName, price, prodDescription, category,brand,isAvailable,quantity } = req.body
    console.log(req.body)
   
    if (req.files.length) {
        for (let file of req.files) {
            console.log(file.path)
            let nam=req.body.prodName
        
            let { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `products/${nam}` }).catch(err=>{next(new Error("name of product not suitable"))})
            console.log({ secure_url, public_id })
            arr.push({ secure_url, public_id })
        }
    }
    ProdModel.create({
        prodName,
        price,
        brand,
        isAvailable,
        newPrice: price,
        prodDescription,
        category,
        quantity,
        images: arr
    }).then(result => { doneResponse(res, result) }).catch(err => { next(new Error(err, { cause: 500 })) })

})
export const getAllProducts = ErrorHandler(
    async (req, res, next) => {
        let { category, price ,brand } = req.query
        console.log({ category, price })
        let query
        if (category && price) {
            price = JSON.parse(price)
            query = {
                category: category,
                price: { $gte: price[0], $lte: price[1] },
            };
        } else if (category) {
            query = {
                category: category
            };
        } else if (price) {
            price = JSON.parse(price)
            query = {
                price: { $gte: price[0], $lte: price[1] },
            };
        }else if(brand){
            query = {
                brand: brand
            };
                }
        let allProducts = query ? await ProdModel.find(query) : await ProdModel.find()
        allProducts ? doneResponse(res, allProducts) : next(new ErrorHandler('No products available at this time', { cause: 404 }))
    }
)
export const dltProduct = ErrorHandler(
    async (req, res, next) => {
        // console.log(req.params)
        const { id } = req.params
        console.log(id)
        let delted = await ProdModel.findByIdAndDelete(id)
        if(delted){
            let arr= delted.images
        let tr
        console.log(arr)
        arr.map(async ele=>{
            tr= await cloudinary.uploader.destroy(ele.public_id, function(error,result) {
            console.log(result, error) });
        })
        console.log(tr)
        delted ? doneResponse(res, delted) : next(new Error('This product is already deleted', { cause: 404 }))
        }

    }
)
export const getProductById = ErrorHandler(
    async (req, res, next) => {
        let { id } = req.params
        console.log(id)
        let product = await ProdModel.findById(id)
        product ? doneResponse(res, product) : next(new Error(`product doesn't exist`, { cause: 404 }))
    }
)
export const updateProduct = ErrorHandler(
    async (req, res, next) => {
        let { id } = req.params
        let { price, isAvailable, prodName, prodDescription, sale, category,brand ,isNew ,quantity} = req.body
        let newPrice
        console.log(req.body)
        if (price) {
            newPrice = price
        }
        if (sale) {
            newPrice = price - sale
        } else {
            if (price) {
                newPrice = price
            }

        }
        let updated = await ProdModel.findByIdAndUpdate(id, { price, isAvailable, prodName, prodDescription, newPrice, sale, category,brand,isNew,quantity,Rating }, { new: true })
        updated ? doneResponse(res, updated) : next(new Error('error in update product or product dosn`t exist', { cause: 500 }))
    }
)
export const searchByName = ErrorHandler(
    async (req, res, next) => {
        console.log('ssss')
        const { name } = req.query
        const client = algoliasearch(process.env.ALOGIAAPPLICATIONID, process.env.ADMINAPIKEY);
        const index = client.initIndex(process.env.INDEXNAME);
        const allproductdata = await ProdModel.find()
        console.log(allproductdata)
        const transformedRecords = allproductdata.map(record => ({
            ...record,
            objectID: record._id
        }));
        console.log(transformedRecords)

        index.saveObjects(transformedRecords).then(({ objectIDs }) => {
            console.log(objectIDs);
        })
            .catch(err => {
                next(new Error('no items found'))
            });

        index
            .search(`${name}`)
            .then(({ hits }) => {
                console.log(hits);
                let result = []
                hits.map(ele => {
                    let resl = { ...ele._doc }
                    result.push(resl)
                })
                doneResponse(res, result)
            })
            .catch(err => {
                next(new Error('error in search process', { cause: 500 }))
            });
    }
)
export const deleteImageOfProduct = ErrorHandler(
    async (req, res, next) => {
        let { id } = req.params
        let { pid } = req.query
        cloudinary.uploader.destroy(pid, function (error, result) {
            console.log(result, error);
        });
        let prods = await ProdModel.findById(id)
        let newimages = prods.images.filter(ele => {
            return ele.public_id != pid
        })
        console.log(newimages)
        let delted = await ProdModel.findByIdAndUpdate(id, { images: newimages }, { new: true })
        delted ? doneResponse(res, delted) : next(new Error('error in deleting image', { cause: 500 }))
    }
)
export const addImageForProduct = ErrorHandler(
    async (req, res, next) => {
        let { id } = req.params
        console.log(req.files)
        let { prodName, images } = await ProdModel.findById(id)
        console.log({ prodName, images })

        if (req.files) {
            for (let file of req.files) {
                let { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `products/${prodName}` })
                images.push({ secure_url, public_id })
            }
        }
        console.log(images)
        let updates = await ProdModel.findByIdAndUpdate(id, { images }, { new: true })
        updates ? doneResponse(res, updates) : next(new Error('error in adding image', { cause: 500 }))
    }
)
