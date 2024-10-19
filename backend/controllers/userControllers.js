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
    console.log('user data', req.body.password)

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

const logoutCurrentUser = asyncHandler(async (req, res) => {
    // create cookie token by removing token
    req.cookies('jwt', '', {
        htmlOnly: true,
        expires: new Date(0),
    })
    res.status(200).json({ message: 'User Logged out successfully' })
})
const getCurrentUserProfile = asyncHandler(async (req, res) => {
    // get user by req.user._id & get user data
    const user = await userModel.findById(req.user._id)
    if (!user) return res.json({ message: "User not found!" })
    res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
    })

})
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    // find user data by req.user._id & update the user data
    const user = await userModel.findById(req.user._id)
    if (!user) return res.json({ message: 'User not found!' })
    user.username = req.body.username || user.username
    user.email = req.body.email || user.email
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        user.password = hashedPassword || user.password
    }

    const updatedUser = await user.save()

    res.status(201).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
    })
})
const deleteUserById = asyncHandler(async (req, res) => {
    await userModel.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "User deleted Successfully" })
})
const getUserById = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found!" })
    res.status(201).json(user)
})
const updateUserById = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found!' })
    user.username = req.body.username || user.username
    user.email = req.body.email || user.email
    user.isAdmin = Boolean(req.body.isAdmin) || user.isAdmin

    const updatedUser = await user.save()

    res.status(201).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        emial: updatedUser.email,
        isAdmin: updatedUser.isAdmin
    })
})

export {
    getAllUser,
    createUser,
    userLogin,
    logoutCurrentUser,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById,
}