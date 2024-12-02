import express from "express";
import formidable from 'express-formidable'
const router = express.Router()

import { authorizeUser, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from '../middlewares/checkId.js'
import {
    addProduct,
    updateProductDetails,
    removeProduct,
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    addProductReview,
    fetchTopProducts,
    fetchNewProducts,
    filterProducts
} from "../controllers/productController.js";

router.route('/')
    .get(fetchProducts)
    .post(authorizeUser, authorizeAdmin, addProduct);

router.route('/top').get(fetchTopProducts)
router.route('/new').get(fetchNewProducts)

router.route('/filtered-products').post(filterProducts)


router.route('/allproducts').get(fetchAllProducts)
router.route('/:id/reviews').post(authorizeUser, checkId, addProductReview)

router.route('/:id')
    .get(fetchProductById)
    .put(authorizeUser, authorizeAdmin, updateProductDetails)
    .delete(authorizeUser, authorizeAdmin, removeProduct)

export default router;