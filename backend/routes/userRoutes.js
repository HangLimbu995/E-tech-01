import express from 'express'
import { createUser, getAllUser, userLogin } from '../controllers/userControllers.js';

const userRouter = express.Router()

userRouter.route('/')
    .post(createUser)
    .get(getAllUser)

userRouter.route('/login')
    .post(userLogin)

export default userRouter;