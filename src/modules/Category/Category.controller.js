import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "../../../DB/models/Category.js";


export const getCategory = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
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
  const categories = await Category.find({ gender: "male" });
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
  const categories = await Category.find({ gender: "female" });
  if (!categories) {
    return next(new Error("not found categories for female"));
  }
  return res.json({
    success: true,
    message: "all categories for female",
    categories,
  });

});
