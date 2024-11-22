import asyncHandler from 'express-async-handler'
import ProductModel from '../models/productModel.js'
import mongoose from 'mongoose';

const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation
    if (!name) return res.status(400).json({ success: false, message: "Name is required!" })

    if (!description) return res.status(400).json({ success: false, message: "Description is required!" })

    if (!price || isNaN(price) || price <= 0) return res.status(400).json({ success: false, message: "Price is required!" })

    if (!category) return res.status(400).json({ success: false, message: "Category is required!" })

    if (!quantity || !Number.isInteger(Number(quantity)) || quantity <= 0) return res.status(400).json({ success: false, message: "Quantity is required!" })

    if (!brand) return res.status(400).json({ success: false, message: "Brand is required!" })

    const product = new ProductModel({ name, description, price, category, quantity, brand })
    await product.save()
    res.status(201).json({ success: true, message: 'Product added successfully!', data: product })
})

const updateProductDetails = asyncHandler(async (req, res) => {
    const { name, description, price, category, quantity, brand } = req.fields

    // Validation
    if (!name) return res.status(400).json({ success: false, message: "Name is required!" })

    if (!description) return res.status(400).json({ success: false, message: "Description is required!" })

    if (!price || isNaN(price) || price <= 0) return res.status(400).json({ success: false, message: "Price is required!" })

    if (!category) return res.status(400).json({ success: false, message: "Category is required!" })

    if (!quantity || !Number.isInteger(Number(quantity)) || quantity <= 0) return res.status(400).json({ success: false, message: "Quantity is required!" })

    if (!brand) return res.status(400).json({ success: false, message: "Brand is required!" })

    const product = await ProductModel.findByIdAndUpdate(req.params.id, { name, description, price, category, quantity, brand })
    await product.save()
    res.status(200).json({ success: true, message: "Product Updated Successfully!", data: product })
})

const removeProduct = asyncHandler(async (req, res) => {
    const { id } = req.params

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID!' })
    }

    const product = await ProductModel.findByIdAndDelete(id)
    if (!product) return res.status(404).json({ success: false, message: "Prdouct not found!" })
    res.status(200).json({ success: true, message: 'Product successfully deleted!' })
})

const fetchProducts = asyncHandler(async (req, res) => {
    const pageSize = 6;
    // req.query.keyword retrieves the keyword query parameter
    // $regex creates a regural expression ot perfom a partial match on the product name.
    // $option:'i' makes the search case-insensitive.
    const keyword = req.query.keyword
        ? { name: { $regex: req.query.keyword, $options: 'i' } }
        : {}

    // This counts the total number of products matching the keyword filter this is useful to calculate the total number of pages for pagination.
    const count = await ProductModel.countDocuments({ ...keyword })
    const products = await ProductModel.find({ ...keyword }).limit(pageSize)

    res.status(200).json({
        products,
        page: 1,
        pages: Math.ceil(count / pageSize),
        hasMore: false,
    })
})

const fetchPrdouctById = asyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: "Prdouct not found!" })
    res.status(200).json({ success: true, data: product })
})

const fetchAllProducts = asyncHandler(async (req, res) => {
    const product = await ProductModel.find({}).populate('category').limit(12).sort({ createAt: -1 })
    res.status(200).json({ success: true, data: product })
})

const addProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body
    const product = await ProductModel.findById(req.params.id)

    if (product) {
        const alreadyReviewd = product.reviews.find((r) => r.user.toString() === req.user._id.toString())

        if (alreadyReviewd) {
            res.status(400).json({ success: false, message: 'Product already reviewd!' })
        }

        const review = {
            name: req.user.username,
            rating: Number(rating),
            comment,
            user: req.user._id,
        }

        product.reviews.push(review)
        product.numReviews = product.reviews.length

        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        await product.save()
        res.status(201).json({ success: true, message: "Review added" })
    }
})

const fetchTopProducts = asyncHandler(async (req, res) => {
    const products = await ProductModel.find({}).sort({ rating: -1 }).limit(4)
    res.status(200).json({ success: true, message: "Top Revied Products", data: products })
})

const fetchNewProducts = asyncHandler(async (req, res) => {
    const products = await ProductModel.fing({}).sort({ _id: -1 }).limit(5)
    res.status(200).json({ success: true, message: "New Products fetched!", data: products })
})

const filterProducts = asyncHandler(async (req, res) => {
    const { checked = [], radio = [] } = req.body

    // Validate input
    if (!Array.isArray(checked) || !Array.isArray(radio)) {
        return res.status(400).json({ success: false, message: "Invalid filter input!" })
    }
    if (!checked.length && !radio.length) {
        return res.status(400).json({ success: false, message: "No filters provided!" })
    }


    if (radio.length && (radio.length !== 2) || isNaN(radio[0]) || isNaN(radio[1])) {
        return res.status(400).json({ success: false, message: "Invalid price range!" })
    }

    // Build query arguments
    let args = {}
    if (checked.length > 0) args.category = checked
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }

    // Fetch filtered products
    const products = await ProductModel.find(args).select("name price category")

    res.status(200).json({ success: true, message: "Prdouct filtered!", data: products })
})

export {
    addProduct,
    updateProductDetails,
    removeProduct,
    fetchProducts,
    fetchPrdouctById,
    fetchAllProducts,
    addProductReview,
    fetchTopProducts,
    fetchNewProducts,
    filterProducts,
}