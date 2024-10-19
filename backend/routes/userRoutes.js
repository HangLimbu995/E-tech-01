import express from 'express'
import { createUser, deleteUserById, getAllUser, getCurrentUserProfile, getUserById, logoutCurrentUser, updateCurrentUserProfile, updateUserById, userLogin } from '../controllers/userControllers.js';

const userRouter = express.Router()

userRouter.route('/')
    .post(createUser)
    .get(getAllUser)

userRouter.post('/auth', userLogin)
userRouter.post('/logout', logoutCurrentUser)

userRouter.route('/profile')
    .get(getCurrentUserProfile)
    .put(updateCurrentUserProfile)

userRouter.route('/:id')
    .get(getUserById)
    .put(updateUserById)
    .delete(deleteUserById)

export default userRouter;