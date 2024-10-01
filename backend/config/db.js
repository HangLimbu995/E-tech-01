
import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        console.log('checking mongodb uri from .env',process.env.MONGODB_URI)
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Successfully connected to mongoDB')
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB
