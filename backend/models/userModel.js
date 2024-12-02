import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {
        type: String, required: true,trim:true,
    },
    email: {
        type: String, required: true,trim: true,
    },
    password: {
        type: String, required: true,trim:true,
    },
    isAdmin: {
        type: Boolean, default: false,
    },
}, { timestamps: true })

const userModel = mongoose.models.User || mongoose.model('User', userSchema)
export default userModel