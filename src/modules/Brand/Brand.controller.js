import { Brand } from "../../../DB/models/Brand.js";
import { Category } from "../../../DB/models/Category.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";



export const create = asyncHandler(async (req, res, next) => {
  const { categories } = req.body;
  categories.forEach(async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(
        new Error(`Category with id ${categoryId} does not exist`, {
          cause: 404,
        })
      );
    }
  });
  if (!req.file) {
    return next(
      new Error("please upload an image for the brand", { cause: 400 })
    );
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.Cloud_Folder_Name}/brands/${req.body.name}` }
  );
  const brand = await Brand.create({
    name: req.body.name,
    image: { url: secure_url, id: public_id },
  });
  categories.forEach(async (categoryId) => {
    const category = await Category.findById(categoryId);
    category.brands.push(brand._id);
    await category.save();
  });
  return res.json({
    success: true,
    message: "Brand created successfully",
    brand,
  });
});
