import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema
const schema = mongoose.Schema

const reviewSchema = new schema({
    name: {type: String, required: true},
    rating: {type: Number, required: true},
    comment: {type: String, requried: true},
    user: {
        type: ObjectId,
        reqruired: true,
        ref: 'User',
    }
},{timestamps: true})

const productSchema = new schema({
    name: {type: String, requried: true},
    image: {type: String, requried: true},
    brand: {type: String, reqruired: true},
    quantity: {type: Number, reqruired: true},
    category: {
        
    }
})