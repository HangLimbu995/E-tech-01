import express from 'express'
import { createCategory, getCategory, listCategory, removeCategory, updateCategory } from '../controllers/categoryController.js';
import { authorizeAdmin, authorizeUser } from '../middlewares/authMiddleware.js';

const categoryRoutes = express.Router()

categoryRoutes.post('/', authorizeUser, authorizeAdmin, createCategory)

categoryRoutes.get('/categories', listCategory)

categoryRoutes.route('/:categoryId')
    .get(getCategory)
    .put(authorizeUser, authorizeAdmin, updateCategory)
    .delete(authorizeUser, authorizeAdmin, removeCategory)

export default categoryRoutes;