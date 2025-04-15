import { Brand } from "../../../DB/models/Brand.js";
import { Category } from "../../../DB/models/Category.js";
import { Product } from "../../../DB/models/Product.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

export const createBrand = asyncHandler(async (req, res, next) => {
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
        logo: { url: secure_url, id: public_id },
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


export const deleteBrand = asyncHandler(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return next(new Error('Brand not found', 404));
    
    const products = await Product.find({ brandId: req.params.id });
    if (products.length > 0) 
        return next(new Error("Cannot delete brand with existing products", { cause: 400 }));
    await Category.updateMany({}, { $pull: { brands: req.params.id } });
    

    await cloudinary.uploader.destroy(brand.logo.id);
    await brand.deleteOne();

    return res.json({ success: true, message: "Brand deleted successfully" });
})

export const updateBrand = asyncHandler(async (req, res, next) => {
        const brand = await Brand.findById(req.params.id);
    
    if (!brand) return next(new Error("Brand not found ", { cause: 404 }))


    if (req.file) {
        if (brand.logo?.id) { 
            await cloudinary.uploader.destroy(brand.logo.id);
        } 
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.Cloud_Folder_Name}/brands/${brand.name}`
        });
        brand.logo = { url: secure_url, id: public_id };
    }
    brand.name = req.body.name ? req.body.name : brand.name;

    await brand.save();
    return res.json({ success: true, message: "Brand updated successfully" });
});


export const AllBrand = asyncHandler(async (req, res, next) => {
    const brand = await Brand.find();
    return res.json({ success: true, data: brand });
})



