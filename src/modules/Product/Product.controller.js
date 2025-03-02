import { Brand } from "../../../DB/models/Brand.js";
import { Category } from "../../../DB/models/Category.js";
import { Product } from "../../../DB/models/Product.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { Types } from "mongoose";

export const create = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);
  if (!category) return next(new Error("Category not found"));

  if (req.body.brand) {
    const brand = await Brand.findById(req.body.brand);
    if (!brand) return next(new Error("Brand not found"));
  }
  if (!req.files) {
    return next(new Error("Please upload a product image"));
  }
  const folder = req.body.name;

  let images = [];
  const subImages = req.files?.images || [];
  if (!Array.isArray(subImages)) {
    return next(new Error("sub images must be an array"));
  }
  for (const file of subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.CLOUD_FOLDER_NAME}/products/${folder}` }
    );
    images.push({ url: secure_url, id: public_id });
  }

  if (!req.files.defaultImage || !req.files.defaultImage.length) {
    return next(new ErrorResponse("Default image is required", 400));
  }

  const { secure_url: defaultImageUrl, public_id: defaultImageId } =
    await cloudinary.uploader.upload(req.files.defaultImage[0].path, {
      folder: `${process.env.Cloud_Folder_Name}/products/${folder}`,
    });

  if (typeof req.body.attributes === "string") {
    try {
      req.body.attributes = JSON.parse(req.body.attributes);
    } catch (error) {
      return next(new Error("Invalid JSON format in attributes"));
    }
  }

  const product = await Product.create({
    ...req.body,
    images,
    defaultImage: {
      url: defaultImageUrl,
      id: defaultImageId,
    },
  });

  return res.json({
    success: true,
    message: "your products added successfully",
    product,
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse("Product not found", 404));
  }
  await product.deleteOne();
  const ids = product.images.map((image) => image.id);
  ids.push(product.defaultImage.id);
  await cloudinary.api.delete_all_resources(ids);
  await cloudinary.api.delete_folder(
    `${process.env.Cloud_Folder_Name}/products/${product.name}`
  );
  return res.json({
    success: true,
    message: "product deleted successfully",
  });
});





export const allProducts = asyncHandler(async (req, res, next) => {
  const { sort, page, keyword, category, brand } = req.query;

  let filter = {}

  if (category){ 
    const categoryExists = await Category.findById(category);
    if (!categoryExists) return next(new Error("Category not Found"))
      filter.category = new Types.ObjectId(category);
  }

  if (brand) {
    const brandExists = await Brand.findById(brand);
    if (!brandExists) return next(new Error("Brand not Found"));
    filter.brand =  new Types.ObjectId(brand);;
  }

  let productQuery=Product.find(filter)
  if(keyword){
    productQuery=productQuery.search(keyword)
  }
  if(sort){
    productQuery=productQuery.sort(sort)
  }
  productQuery = productQuery.pagination(page);
  const products = await productQuery;

  return res.json({
    success: true,
    products:products,
  });
});
