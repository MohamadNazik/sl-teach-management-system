import inputDetails from "../../models/inputDetails.js";

import fs from "fs";

export const createRecieptController = async (req, res) => {
  try {
    const fields = req.fields;
    const files = req.files;

    let savedFiles = {};

    if (files && Object.keys(files).length > 0) {
      for (let key in files) {
        const file = files[key];
        const data = fs.readFileSync(file.path);

        savedFiles[key] = {
          name: file.name,
          type: file.type,
          path: data,
        };
      }
    }

    const newInputDetail = new inputDetails({
      fields: {
        ...fields,
        ...savedFiles,
      },
    });

    const savedDetail = await newInputDetail.save();

    res.status(201).json({
      message: "Input details and files saved successfully",
      savedDetail,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error saving input details and files", error });
  }
};
