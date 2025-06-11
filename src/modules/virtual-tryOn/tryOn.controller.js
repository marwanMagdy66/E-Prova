import { virtualOn } from "../../../DB/models/virtualOn.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import axios from "axios";

export const tryOn = asyncHandler(async (req, res, next) => {
  const { garment_image, description } = req.body;
  if (!req.file) {
    return next(new Error("Please upload a human image", { cause: 400 }));
  }

  try {
    // Upload the human image to Cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.Cloud_Folder_Name}/virtualOn/users/` }
    );

    // Get the human image as base64
    const humanImageResponse = await axios.get(secure_url, {
      responseType: "arraybuffer",
    });
    const humanImageBuffer = Buffer.from(humanImageResponse.data);
    const humanImageBase64 = humanImageBuffer.toString("base64");

    // Handle garment image
    let garmentImageBase64;
    if (typeof garment_image === "string") {
      if (garment_image.startsWith("data:image")) {
        // Extract base64 from data URL
        garmentImageBase64 = garment_image.split(",")[1];
      } else if (garment_image.startsWith("http")) {
        // If it's a URL, download and convert to base64
        const garmentResponse = await axios.get(garment_image, {
          responseType: "arraybuffer",
        });
        garmentImageBase64 = Buffer.from(garmentResponse.data).toString(
          "base64"
        );
      } else {
        // Assume it's already a base64 string
        garmentImageBase64 = garment_image;
      }
    } else {
      return next(new Error("Invalid garment image format", { cause: 400 }));
    }

    // Prepare JSON data for Colap AI
    const colapData = {
      human_image: humanImageBase64,
      garment_image: garmentImageBase64,
      description: description || "a t-shirt",
    };

    console.log("Sending request to Colap AI...");
    console.log("Human image length:", humanImageBase64.length);
    console.log("Garment image length:", garmentImageBase64.length);

    let colapResponse;
    try {
      colapResponse = await axios.post(
        "https://8282-104-154-235-204.ngrok-free.app/virtual-tryon",
        colapData,
        {
          headers: {
            "Content-Type": "application/json",
          },
         timeout: 300000, // 5 minutes timeout
        }
      );
    } catch (colapError) {
      console.error("Colap AI Error Details:", {
        message: colapError.message,
        status: colapError.response?.status,
        data: colapError.response?.data,
        code: colapError.code,
      });
      throw new Error(`Colap AI Error: ${colapError.message}`);
    }

    if (!colapResponse.data || !colapResponse.data.result_image) {
      throw new Error("Invalid response from Colap AI: Missing result image");
    }

    // Convert result image to buffer and upload to Cloudinary
    const resultImageBuffer = Buffer.from(
      colapResponse.data.result_image,
      "base64"
    );
    const resultImageBase64 = `data:image/jpeg;base64,${colapResponse.data.result_image}`;

    // Upload result image to Cloudinary
    let resultUpload;
    try {
      resultUpload = await cloudinary.uploader.upload(resultImageBase64, {
        folder: `${process.env.Cloud_Folder_Name}/virtualOn/results/`,
        resource_type: "image",
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary Upload Error:", cloudinaryError);
      throw new Error(`Cloudinary Upload Error: ${cloudinaryError.message}`);
    }

    // Create a new virtual try-on record with the result
    let newVirtualOn;
    try {
      newVirtualOn = await virtualOn.create({
        human_image: humanImageBase64,
        garment_image: garmentImageBase64,
        description,
        result_image: resultUpload.secure_url,
      });
    } catch (dbError) {
      console.error("Database Error:", dbError);
      throw new Error(`Database Error: ${dbError.message}`);
    }

    res.json({
      success: true,
      message: "Virtual try-on created successfully",
      virtualOn: newVirtualOn,
      result: {
        ...colapResponse.data,
        result_url: resultUpload.secure_url,
      },
    });
  } catch (error) {
    console.error("Error in tryOn:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code,
    });
//mannn
    if (error.code === "ECONNABORTED") {
      return next(
        new Error(
          "Request timed out. The model is taking longer than expected.",
          { cause: 504 }
        )
      );
    }

    return next(
      new Error(`Error processing virtual try-on: ${error.message}`, {
        cause: error.response?.status || 500,
      })
    );
  }
});