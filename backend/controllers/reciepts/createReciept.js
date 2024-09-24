import inputDetails from "../../models/inputDetails.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createRecieptController = async (req, res) => {
  try {
    const fields = req.fields;
    const files = req.files;

    const userDir = path.join(__dirname, "..", "uploads");
    // console.log("User Directory:", userDir);

    if (!fs.existsSync(userDir)) {
      console.log(`Creating directory for user: ${userDir}`);
      fs.mkdirSync(userDir, { recursive: true });
    }

    if (files && Object.keys(files).length > 0) {
      for (let key in files) {
        const file = files[key];

        if (!file || !file.path || !file.name) {
          console.error(
            `File, file path, or file name is undefined for key: ${key}`
          );
          return res.status(400).json({ message: "Invalid file upload" });
        }

        // console.log(`Processing file: ${file.name}, path: ${file.path}`);

        const tempPath = file.path;
        const newFilePath = path.join(userDir, file.name);
        // console.log("New File Path:", newFilePath);

        fs.renameSync(tempPath, newFilePath);

        fields[key] = newFilePath;
      }
    }

    if (fields.price) {
      const price = parseFloat(fields.price);
      if (isNaN(price)) {
        return res.status(400).json({ message: "Invalid price format" });
      }
      fields.price = price; // Store the price as a float
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
