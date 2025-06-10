import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import axios from "axios";
export const getGarment=asyncHandler(async(req,res,next)=>{
   try {
        // Get the garment image from Cloudinary
        const garmentUrl = "https://res.cloudinary.com/ds31nfjfq/image/upload/v1749522749/E-Prova/products/mann/npqtedl28vuwatowuvs9.jpg";
        
        // Download the image
        const response = await axios.get(garmentUrl, { responseType: 'arraybuffer' });
        
        // Convert to base64
        const base64Image = Buffer.from(response.data).toString('base64');
        
        res.json({
            garment_image: base64Image
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }


})

export const result = asyncHandler(async (req, res, next) => {
        try {
        const { resultImage } = req.body;
        
        // Upload result to Cloudinary
        const result = await cloudinary.uploader.upload_stream(
            file.path,
      { folder: `${process.env.Cloud_Folder_Name}/products/${folder}` })
      .end(Buffer.from(resultImage, 'base64'));
        
        res.json({ resultUrl: result.secure_url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})