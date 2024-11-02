import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import Favourite from "../../models/favourite.js";
import inputDetails from "../../models/inputDetails.js";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const deleteRecieptController = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the receipt details
    const result = await inputDetails.findById(id);
    if (!result) {
      return res.status(404).send({
        success: false,
        message: "No data found to delete",
      });
    }

    const filePath = result.fields.get("Upload Image");

    if (filePath && filePath.includes("amazonaws.com")) {
      const regex = new RegExp(`.*?\\.com/(.+)`);
      const match = filePath.match(regex);

      if (match && match[1]) {
        const fileKey = match[1];

        const decodedFileKey = decodeURIComponent(fileKey);

        // Delete the file from S3
        const response = await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: decodedFileKey,
          })
        );
      } else {
        console.error(
          "File key extraction failed. The file path may not be formatted correctly."
        );
        return res.status(400).send({
          success: false,
          message: "File key extraction failed.",
        });
      }
    }
    console.log(id);

    await Favourite.deleteOne({ recieptId: id });
    await inputDetails.findByIdAndDelete(id);

    return res.status(200).send({
      success: true,
      data: result,
      message: "Receipt and associated file deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting receipt and file:", error);
    res.status(500).send({
      success: false,
      message: "Error deleting receipt",
    });
  }
};
