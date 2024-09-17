import inputDetails from "../../models/inputDetails.js";
import fs from "fs";

export const updateRecieptController = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.fields || {};
    const files = req.files || {};

    const existingReciept = await inputDetails.findById(id);
    if (!existingReciept) {
      return res.status(404).send({
        success: false,
        message: "No receipt found to update",
      });
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

    let updatedFiles = {};
    if (Object.keys(files).length > 0) {
      for (const key in files) {
        const file = files[key];
        const data = fs.readFileSync(file.path);

        updatedFiles[key] = {
          name: file.name,
          type: file.type,
          path: data,
        };
      }
    }

    const updatedReciept = await inputDetails.findByIdAndUpdate(
      id,
      {
        $set: {
          fields: {
            ...existingReciept.fields.toObject(),
            ...sanitizedFields,
            ...updatedFiles,
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
