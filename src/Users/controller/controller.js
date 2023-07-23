import mongoose from "mongoose"
import { userModel } from "../../../DB/models/user_model.js"
import { ErrorHandler } from "../../../utils/ErrHandler.js"
import { doneResponse } from "../../../utils/done.js"
import { generateToken, verifyToken } from "../../../utils/generateToken.js"
import { createOptions, sendEmail } from "../../../utils/nodemailer.js"

export const signup = ErrorHandler(async (req, res, next) => {
    let { firstName, lastName, gmail, password, location, mobileNo } = req.body
    const done = await userModel.create({
        firstName, lastName, gmail, password, location, mobileNo
    }).catch(err => next(new Error(err)))
    if (done) {
        const token = generateToken({ gmail , id:done._id })
        const options = createOptions(gmail, "http://localhost:5050/user/", token)
        sendEmail(options)
        doneResponse(res, 'please verify your gmail account ')
    } else {
       next(new Error('error',{cause:500}))
    }
})
export const login = ErrorHandler(
    async (req, res, next) => {
        let { gmail, password } = req.body
        console.log({ gmail, password })
        let loginn = await userModel.findOne({ gmail, password })
        console.log(loginn)
        const token = generateToken({ gmail , id:loginn._id })
        loginn ? doneResponse(res, {loginn,token}) : next(new Error('in-valid email or password', { cause: 401 }))
    }
)
export const getUserById = ErrorHandler(
    async (req, res, next) => {
        let { id } = req.params
        console.log(id)
        let user = await userModel.findById(id)
        user ? doneResponse(res, user) : next(new Error(`User doesn't exist`, { cause: 404 }))
    }
)
export const getAllUsers = ErrorHandler(
    async (req, res, next) => {
        let data = await userModel.find()
        data ? doneResponse(res, data) : next(new Error("error while fetching data"))
    }
)
export const verify = ErrorHandler(
    async (req, res, next) => {
        let { token } = req.params
        console.log(token)
        let data = verifyToken(token)
        console.log(data.gmail)
        let done = await userModel.findOneAndUpdate({ gmail: data.gmail }, { verified: true }, { new: true })
        done ? doneResponse(res, done) : next(new Error("error while verifing"))
    }
)
export const dltuser = ErrorHandler(
    async (req, res, next) => {
        let { gmail } = req.body
        console.log(gmail)
        let done = await userModel.findOneAndDelete({ gmail })
        done ? doneResponse(res, done) : next(new Error("error in delete this email"))
    }
)
export const addToCart = ErrorHandler(
    async (req, res, next) => {
        let { _id, quantity } = req.body
        let { id } = req.params
        let user = await userModel.findById(id)
        let { cart } = user
        let newCart = []
        let flag = true
        cart.map(item => {
            console.log(item)
            console.log(_id)
            if (item._id.toString() == _id) {
                flag = false
                let newItem = { ...item }
                console.log(newItem)
                newItem._doc.quantity = item.quantity + quantity
                newCart.push(newItem._doc)
                console.log("ana new cart")
                console.log(newCart)
            } else {
                newCart.push(item)
            }

        })
        if (flag) {
            newCart.push({ _id, quantity })
        }
        console.log(newCart)
        let add = await userModel.findByIdAndUpdate(id, { cart: newCart }, { new: true })
        add ? doneResponse(res, add) : next(new Error("error in adding to cart"))
    }
)

export const updateCart = ErrorHandler(
    async (req, res, next) => {
        let { id, _id } = req.params
        let { quantity } = req.body
        let user = await userModel.findById(id)
        let { cart } = user
        let newCart = []
        cart.map(item => {
            console.log(item._id == _id)
            if (item._id == _id) {
                console.log(quantity != 0)
                if (quantity != 0) {
                    let newItem = { ...item._doc }
                    console.log(newItem)
                    newItem["quantity"] = quantity
                    console.log(quantity)
                    console.log(newItem.quantity)
                    newCart.push(newItem)
                }
            }
            else { newCart.push(item) }
        })
        let add = await userModel.findByIdAndUpdate(id, { cart: newCart }, { new: true })
        add ? doneResponse(res, add) : next(new Error("error in updating cart"))
    }
)
export const dltFromCart=ErrorHandler(
    async(req,res,next)=>{
         let { id, _id } = req.params
         let user = await userModel.findById(id)
         let { cart } = user
         let newid=new mongoose.Types.ObjectId(_id)
         let arr=[]
         let newcart= cart.map(items=>{!(items._id.equals(_id))})
          console.log(newcart)
         let add = await userModel.findByIdAndUpdate(id, { cart: newcart }, { new: true })
         add ? doneResponse(res, add) : next(new Error("error in adding to cart list"))
     }
 )
export const addToWishList = ErrorHandler(
    async (req, res, next) => {
        let { id, _id } = req.params
        let user = await userModel.findById(id)
        let { wishList } = user
        let newid=new mongoose.Types.ObjectId(_id)
        let newwishlist = [...wishList]
        let containsId = newwishlist.some(objId => objId.equals(newid));
        if(! containsId){
            newwishlist.push(_id)
        }
         // newwishlist.push()
        let add = await userModel.findByIdAndUpdate(id, { wishList: newwishlist }, { new: true })
        add ? doneResponse(res, add) : next(new Error("error in adding to wish list"))
    }
)

export const dltFromWishList=ErrorHandler(
   async(req,res,next)=>{
        let { id, _id } = req.params
        let user = await userModel.findById(id)
        let { wishList } = user
        let newid=new mongoose.Types.ObjectId(_id)
        let newwishlist= wishList.filter(items=> !(items.equals(_id)))
         console.log(newwishlist)
        let add = await userModel.findByIdAndUpdate(id, { wishList: newwishlist }, { new: true })
        add ? doneResponse(res, add) : next(new Error("error in adding to wish list"))
    }
)
