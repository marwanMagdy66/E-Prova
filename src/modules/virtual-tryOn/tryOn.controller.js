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
    console.log("Starting try-on process...");

    // Upload the human image to Cloudinary
    console.log("Uploading human image to Cloudinary...");
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.Cloud_Folder_Name}/virtualOn/users/` }
    );
    console.log("Human image uploaded successfully:", secure_url);

    // Get the human image as base64
    console.log("Converting human image to base64...");
    const humanImageResponse = await axios.get(secure_url, {
      responseType: "arraybuffer",
    });
    const humanImageBuffer = Buffer.from(humanImageResponse.data);
    const humanImageBase64 = humanImageBuffer.toString("base64");
    console.log(
      "Human image converted to base64, length:",
      humanImageBase64.length
    );

    // Handle garment image
    console.log("Processing garment image...");
    let garmentImageBase64;
    if (typeof garment_image === "string") {
      if (garment_image.startsWith("data:image")) {
        console.log("Garment image is a data URL");
        garmentImageBase64 = garment_image.split(",")[1];
      } else if (garment_image.startsWith("http")) {
        console.log("Garment image is a URL:", garment_image);
        const garmentResponse = await axios.get(garment_image, {
          responseType: "arraybuffer",
        });
        garmentImageBase64 = Buffer.from(garmentResponse.data).toString(
          "base64"
        );
      } else {
        console.log("Garment image is a raw base64 string");
        garmentImageBase64 = garment_image;
      }
      console.log(
        "Garment image processed, length:",
        garmentImageBase64.length
      );
    } else {
      console.error("Invalid garment image format:", typeof garment_image);
      return next(new Error("Invalid garment image format", { cause: 400 }));
    }

    // Prepare JSON data for Colap AI
    const colapData = {
      human_image: humanImageBase64,
      garment_image: garmentImageBase64,
      description: description || "a t-shirt",
    };

    console.log("Sending request to Colap AI...");
    console.log(
      "Request data prepared with lengths - Human:",
      humanImageBase64.length,
      "Garment:",
      garmentImageBase64.length
    );

    try {
      const colapResponse = await axios.post(
        "https://f97c-34-134-39-16.ngrok-free.app/virtual-tryon",
        colapData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 300000, // 5 minutes timeout
        }
      );
      console.log("Received response from Colap AI");

      // Convert result image to buffer and upload to Cloudinary
      console.log("Processing result image...");
      const resultImageBase64 = `data:image/jpeg;base64,${colapResponse.data.result_image}`;

      console.log("Uploading result to Cloudinary...");
      const resultUpload = await cloudinary.uploader.upload(resultImageBase64, {
        folder: `${process.env.Cloud_Folder_Name}/virtualOn/results/`,
        resource_type: "image",
      });
      console.log("Result uploaded to Cloudinary:", resultUpload.secure_url);

      // Create a new virtual try-on record with the result
      console.log("Creating database record...");
      const newVirtualOn = await virtualOn.create({
        human_image: humanImageBase64,
        garment_image: garmentImageBase64,
        description,
        result_image: resultUpload.secure_url,
      });
      console.log("Database record created successfully");

      res.json({
        success: true,
        message: "Virtual try-on created successfully",
        virtualOn: newVirtualOn,
        result: {
          ...colapResponse.data,
          result_url: resultUpload.secure_url,
        },
      });
    } catch (colapError) {
      console.error("Colap AI Error:", {
        message: colapError.message,
        response: colapError.response?.data,
        status: colapError.response?.status,
        headers: colapError.response?.headers,
      });
      throw new Error(`Colap AI Error: ${colapError.message}`);
    }
  } catch (error) {
    console.error("Detailed error in tryOn:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
    });

    return next(
      new Error(`Error processing virtual try-on: ${error.message}`, {
        cause: error.response?.status || 500,
      })
    );
  }
});
