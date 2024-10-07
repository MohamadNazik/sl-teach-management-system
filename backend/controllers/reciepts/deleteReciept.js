import cloudinary from "cloudinary";
import Favourite from "../../models/favourite.js";
import inputDetails from "../../models/inputDetails.js";
import dotenv from "dotenv";
dotenv.config();

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
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

    // Optional: Check if there is a file URL and public_id to delete
    const filePath = result.fields.get("Upload Image");
    // console.log(filePath);

    if (filePath) {
      // Extract the public_id from the file URL to delete the file from Cloudinary
      const publicId = extractPublicId(filePath);

      // Delete the file from Cloudinary using the public_id
      if (publicId) {
        await cloudinary.v2.uploader.destroy(publicId);
      }
    }

    // Delete related data in 'Favourite' and 'inputDetails' collections
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

// Function to extract public_id from Cloudinary file URL
const extractPublicId = (fileUrl) => {
  // Cloudinary URLs generally look like this:
  // https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/<folder_name>/<public_id>
  const parts = fileUrl.split("/");
  const fileNameWithVersion = parts[parts.length - 1]; // e.g., v1234567890/file_name.jpg
  const publicId = fileNameWithVersion.split(".")[0]; // Extract public_id (e.g., 'file_name')

  // Join folder paths and return full public_id
  return parts
    .slice(parts.length - 2)
    .join("/")
    .split(".")[0];
};
