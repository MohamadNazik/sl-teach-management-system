import inputDetails from "../../models/inputDetails.js";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export const updateRecieptController = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.fields || {};
    // const files = req.files || {};

    const existingReciept = await inputDetails.findById(id);
    if (!existingReciept) {
      return res.status(404).send({
        success: false,
        message: "No receipt found to update",
      });
    }

    if (fields.price) {
      const price = parseFloat(fields.price);
      if (isNaN(price)) {
        return res.status(400).json({ message: "Invalid price format" });
      }
      fields.price = price; // Store the price as a float
    }

    const sanitizeFields = (data) => {
      return Object.keys(data).reduce((acc, key) => {
        if (!key.startsWith("$")) {
          acc[key] = data[key];
        }
        return acc;
      }, {});
    };

    const sanitizedFields = sanitizeFields(fields);

    // let updatedFiles = {};

    // const userDir = path.join(__dirname, "..", "uploads");

    // if (!fs.existsSync(userDir)) {
    //   fs.mkdirSync(userDir, { recursive: true });
    // }

    // if (Object.keys(files).length > 0) {
    //   for (const key in files) {
    //     const file = files[key];

    //     if (!file || !file.path || !file.name) {
    //       return res.status(400).json({ message: "Invalid file upload" });
    //     }

    //     // Move new file to the upload directory
    //     const tempPath = file.path;
    //     const newFilePath = path.join(userDir, file.name);

    //     fs.renameSync(tempPath, newFilePath);

    //     updatedFiles[key] = {
    //       name: file.name,
    //       type: file.type,
    //       path: newFilePath,
    //     };
    //   }
    // }

    const updatedReciept = await inputDetails.findByIdAndUpdate(
      id,
      {
        $set: {
          fields: {
            ...existingReciept.fields.toObject(),
            ...sanitizedFields,
            // ...updatedFiles,
          },
        },
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Receipt updated successfully",
      updatedReciept,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error updating receipt",
      error,
    });
  }
};
