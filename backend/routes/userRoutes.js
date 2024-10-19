import express from 'express'
import { createUser, deleteUserById, getAllUser, getCurrentUserProfile, getUserById, logoutCurrentUser, updateCurrentUserProfile, updateUserById, userLogin } from '../controllers/userControllers.js';
import { authorizeAdmin, authorizeUser } from '../middlewares/authMiddleware.js';

const userRouter = express.Router()

userRouter.route('/')
    .post(createUser)
    .get(authorizeUser, authorizeAdmin, getAllUser)

userRouter.post('/auth', userLogin)
userRouter.post('/logout', logoutCurrentUser)

userRouter.route('/profile')
    .get(authorizeUser, getCurrentUserProfile)
    .put(authorizeUser, updateCurrentUserProfile)

userRouter.route('/:id')
    .get(authorizeUser, authorizeAdmin, getUserById)
    .put(authorizeUser, authorizeAdmin, updateUserById)
    .delete(authorizeUser, authorizeAdmin, deleteUserById)

export default userRouter;