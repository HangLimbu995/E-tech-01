import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import userModel from '../models/userModel.js'

const authorizeUser = asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies?.jwt

    if (!token) return res.status(401).json({ success: false, message: 'Not authorized, Token not found!' })

    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    const user = await userModel.findById(decoded.userId).select('-password')
    if (!user) return res.status(404).json({ success: false, message: 'User not found!' })
    req.user = user
// console.log('User authorized')
    next()

})

const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        // console.log("Admin authorized")
        return next()
    } else {
        res.status(500).json({
            success: false, message: 'Authorization denied, you are not admin'
        })
    }
}

export { authorizeUser, authorizeAdmin } 