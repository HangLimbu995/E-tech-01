import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 31,
        unique: true,
        lowerCase: true,
    }
})

const categoryModel = mongoose.models.Category || mongoose.model('Category', categorySchema)
export default categoryModel;