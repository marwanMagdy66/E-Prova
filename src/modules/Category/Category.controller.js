import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "../../../DB/models/Category.js";
import { Product } from "../../../DB/models/Product.js";


export const getCategory = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().populate("brands");
  return res.json({ sucess: true, categories });
});


export const createCategory = asyncHandler(async (req, res, next) => {
  await Category.create({
    name: req.body.name,
    description: req.body.description,
    gender: req.body.gender,
  });

  return res.json({ success: true, message: "Category created successfully" });
});

//delete category
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new Error("Category not found"));
  const product=await Product.find({category:category._id})
  if (product.length > 0) {
    return next(new Error("Cannot delete category with existing products", { cause: 400 }));
  }
  
  await category.deleteOne();
  return res.json({ success: true, message: "Category deleted successfully" });
});

//updateCategory

export const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new Error("Category not found"));

  category.name = req.body.name ? req.body.name : category.name;
  category.description = req.body.description
    ? req.body.description
    : category.description;
  category.gender = req.body.gender ? req.body.gender : category.gender;
  await category.save();

  return res.json({
    success: true,
    message: "category is updated successfully",
  });
});

// men categories
export const menCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({ gender: "male" }).populate("brands");
  if (!categories) {
    return next(new Error("not found categories for men"));
  }
  return res.json({
    success: true,
    message: "all categories for men",
    categories,
  });
});


export const womenCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({ gender: "female" }).populate("brands");
  if (!categories) {
    return next(new Error("not found categories for female"));
  }
  return res.json({
    success: true,
    message: "all categories for female",
    categories,
  });

});


export const getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate("brands");
  if (!category) return next(new Error("Category not found", { cause: 404 }));
  return res.json({
    success: true,
    message: "category found successfully",
    category,
  });
});