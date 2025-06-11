import { virtualOn } from "../../../DB/models/virtualOn.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import axios from "axios";

export const tryOn = asyncHandler(async (req, res, next) => {
  const { garment_image, description } = req.body;
  if (!req.file) {
    return next(new Error("Please upload a human image", { cause: 400 }));
  }
  // Upload the human image to Cloudinary and convert to base64 and put it in variable
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.Cloud_Folder_Name}/virtualOn/users/` }
  );
  const humanImage = Buffer.from(secure_url).toString("base64");
  const garmentImageBase64 = Buffer.from(garment_image).toString("base64");

  // Prepare data for Colap AI
  const colapData = {
    human_image: humanImage,
    garment_image: garmentImageBase64,
    description: description,
  };

  // Send to Colap AI for processing
  try {
    const colapResponse = await axios.post(
      `https://335e-34-134-39-16.ngrok-free.app/virtual-tryon`,
      colapData,
      {
        headers: {
          //   Authorization: `Bearer ${process.env.COLAP_AI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Create a new virtual try-on record with the result
    const newVirtualOn = await virtualOn.create({
      human_image: humanImage,
      garment_image: garmentImageBase64,
      description,
      result_image: colapResponse.data.result_image, // Assuming Colap AI returns the result image
    });

    res.json({
      success: true,
      message: "Virtual try-on created successfully",
      virtualOn: newVirtualOn,
      result: colapResponse.data,
    });
  } catch (error) {
    return next(
      new Error(
        error.response?.data?.message || "Error processing virtual try-on",
        { cause: 500 }
      )
    );
  }
});

// export const getGarment = asyncHandler(async (req, res, next) => {
//   try {
//     // Get the garment image from Cloudinary
//     const garmentUrl =
//       "https://res.cloudinary.com/ds31nfjfq/image/upload/v1749522749/E-Prova/products/mann/npqtedl28vuwatowuvs9.jpg";

//     // Download the image
//     const response = await axios.get(garmentUrl, {
//       responseType: "arraybuffer",
//     });

//     // Convert to base64
//     const base64Image = Buffer.from(response.data).toString("base64");

//     res.json({
//       garment_image: base64Image,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export const result = asyncHandler(async (req, res, next) => {
//   try {
//     const { resultImage } = req.body;

//     // Upload result to Cloudinary
//     const result = await cloudinary.uploader
//       .upload_stream(file.path, {
//         folder: `${process.env.Cloud_Folder_Name}/products/${folder}`,
//       })
//       .end(Buffer.from(resultImage, "base64"));

//     res.json({ resultUrl: result.secure_url });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
