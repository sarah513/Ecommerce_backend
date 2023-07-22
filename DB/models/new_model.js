import { Schema, model } from "mongoose";
const newSchema = new Schema({
    prodID:{type: Schema.Types.ObjectId, ref: 'Product'}
})

export const newModel = model('New', newSchema)