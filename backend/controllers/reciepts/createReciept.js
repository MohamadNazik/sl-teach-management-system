import cloudinary from "cloudinary";
import inputDetails from "../../models/inputDetails.js";
import fs from "fs";
import path from "path";

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: "df8ofqkkk",
  api_key: "242667797751225",
  api_secret: "x5oLvVoAFOzuwsRcBC-ma6awlQ0",
});

export const createRecieptController = async (req, res) => {
  try {
    const fields = req.fields;
    const files = req.files;

    if (files && Object.keys(files).length > 0) {
      for (let key in files) {
        const file = files[key];

        if (!file || !file.path || !file.name) {
          console.error(
            `File, file path, or file name is undefined for key: ${key}`
          );
          return res.status(400).json({ message: "Invalid file upload" });
        }

        const fileExtension = path.extname(file.name).toLowerCase();
        let resourceType = "auto";

        // Handle other file types or skip
        const result = await cloudinary.v2.uploader.upload(file.path, {
          resource_type: resourceType,
          folder: "receipts", // Optional: specify a folder in Cloudinary
          overwrite: true, // Overwrite if a file with the same public_id exists
        });

        // Store the Cloudinary URL in fields
        fields[key] = result.secure_url;
      }

      // Optionally delete the temp file after upload
    }

    if (fields.price) {
      const price = parseFloat(fields.price);
      if (isNaN(price)) {
        return res.status(400).json({ message: "Invalid price format" });
      }
      fields.price = price;
    }

    const newInputDetail = new inputDetails({
      fields,
    });

    const savedDetail = await newInputDetail.save();

    res.status(201).json({
      message: "Input details and files saved successfully",
      savedDetail,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Error saving input details and files", error });
  }
};
