import asyncHandler from 'express-async-handler'
import userModel from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/createToken.js'

const getAllUser = asyncHandler(async (req, res) => {
    const users = await userModel.find()
        .select('-password')
        .sort({ "_id": -1 })
    res.status(200).json(users)
})

const createUser = asyncHandler(async (req, res) => {
    // get username, email, password from req.body
    const { username, email, password } = req.body
    console.log('user data',req.body.password)

    if (!username || !email || !password) throw new Error('Please fill all the fields?')

    // check existing user via email
    const existingUser = await userModel.findOne({ email })
    if (existingUser) throw new Error("User already exist!")

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    if (!hashedPassword) throw new Error('Bcrypt failed')

    // assign to userModel
    const newUser = new userModel({ username, email, password: hashedPassword })

    // save data
    await newUser.save()
    // generateToken
    generateToken(res, newUser._id)
    // res.json data
    res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
    })
})

const userLogin = asyncHandler(async (req, res) => {
    // get email & password and check 
    const { email, password } = req.body
    if (!email || !password) throw new Error('Please fill all the fields?')

    // find via email and check
    const user = await userModel.findOne({ email })
    if (!user) throw new Error("Invalid credentials!")

    // check if hashed password match
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error("Invalid credentials!")

    // generate token
    generateToken(res, user._id)
    // res json
    res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
    })
})

export {
    getAllUser,
    createUser,
    userLogin,
}