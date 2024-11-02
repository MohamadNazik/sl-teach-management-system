import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import fs from "fs";
import inputDetails from "../../models/inputDetails.js";
import path from "path";

dotenv.config();

// AWS S3 configuration for SDK v3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
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
        let contentType;

        // Set content type based on the file extension
        if (fileExtension === ".pdf") {
          contentType = "application/pdf";
        } else if (fileExtension === ".jpg" || fileExtension === ".jpeg") {
          contentType = "image/jpeg";
        } else if (fileExtension === ".png") {
          contentType = "image/png";
        } else {
          return res.status(400).json({ message: "Unsupported file type" });
        }

        // Upload file to S3
        const fileData = fs.readFileSync(file.path);
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `receipts/${file.name}`,
          Body: fileData,
          ContentType: contentType,
          ACL: "public-read",
        };

        await s3.send(new PutObjectCommand(uploadParams));

        fields[
          key
        ] = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/receipts/${file.name}`;

        // Optionally delete the local temp file
        fs.unlinkSync(file.path);
      }
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
