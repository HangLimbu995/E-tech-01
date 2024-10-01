import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'

dotenv.config()
const app = express()

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server listning on port:${port}`)
})