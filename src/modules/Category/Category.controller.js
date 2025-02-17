import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "../../../DB/models/Category.js";
import cloudinary from "../../utils/cloud.js";

export const getCategory = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  return res.json({ sucess: true, categories });
});

export const createCategory = asyncHandler(async (req, res, next) => {
  //check file
  // if (!req.file) return next(new Error("please upload an image"))
  //upload image
  // const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
  //     folder: `${process.env.Cloud_Folder_Name}/Category/{public_id}`
  // })

  //create category
  await Category.create({
    name: req.body.name,
    description: req.body.description,
    // image: { id: public_id, url: secure_url },
    gender: req.body.gender,
  });

  return res.json({ success: true, message: "Category created successfully" });
});

//delete category
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new Error("Category not found"));
  await category.deleteOne();
  // await cloudinary.uploader.destroy(category.image.id);

  return res.json({ success: true, message: "Category deleted successfully" });
});

//updateCategory

export const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new Error("Category not found"));
  // if(req.file){
  //     const {public_id, secure_url }=await cloudinary.uploader.upload(req.file.path,{
  //         public_id: category.image.id,
  //     })
  //     category.image={id:public_id,url:secure_url}
  // }
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
    return next(new Error("not found categoies for men"));
  }
  return res.json({
    success: true,
    message: "all categoies for men",
    categories,
  });
});
