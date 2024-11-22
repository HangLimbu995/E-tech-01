import categoryModel from "../models/categoryModel.js";
import asyncHander from 'express-async-handler'
import mongoose from "mongoose";

const createCategory = asyncHander(async (req, res) => {
    const name = req.body.name?.toLowerCase().trim()
    if (!name) {
        return res.status(400).json({ success: false, message: "Name is required!" })
    }
    const existingCategory = await categoryModel.findOne({ name: name.toLowerCase() })
    if (existingCategory) {
        return res.status(409).json({ success: false, message: "Category Already exist!" })
    }
    console.info('category name is',name.toLowerCase())
    const category = await new categoryModel({ name: name })
    await category.save()
    res.status(201).json({ success: true, data: category })
})

const updateCategory = asyncHander(async (req, res) => {
    const name = req.body.name?.trim()
    const { categoryId } = req.params

    if (!name) {
        return res.status(400).json({ success: false, message: "Name is required!" })
    }

    const category = await categoryModel.findById(categoryId)

    if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found!' })
    }

    category.name = name
    await category.save()
    res.status(200).json({ success: true, message: "Categroy Updated Successfully!", data: category })
})

const removeCategory = asyncHander(async (req, res) => {
    // get categoryId from params and delete it if it exist
    const { categoryId } = req.params

    // validate categoryId formate (optional if useing mongoDB ObjectIds)
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ success: false, message: 'Invalid category ID!' })
    }

    const category = await categoryModel.findById(categoryId)
    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found!" })
    }
    await category.deleteOne()
    res.status(200).json({ success: true, message: "Category Removed successfully!", data: category })
})

const listCategory = asyncHander(async (req, res) => {
    console.info('hello cateogry list')
    const categoryList = await categoryModel.find({})
    if (categoryList.length === 0) {
        return res.status(404).json({ success: false, message: 'No Categories found!', data: [] })
    }
    res.status(200).json({ success: true, data: categoryList })
})

const getCategory = asyncHander(async (req, res) => {
    // get categoryId from params 
    const { categoryId } = req.params

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ success: false, message: 'Invalid category Id formate!' })
    }

    const category = await categoryModel.findById(categoryId)
    if (!category) {
        return res.status(404).json({ success: false, message: `Category with ${categoryId} not found!` })
    }
    res.status(200).json({ success: true, category })
})

export { createCategory, updateCategory, removeCategory, listCategory, getCategory }


