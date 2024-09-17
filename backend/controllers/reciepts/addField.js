import inputDetails from "../../models/inputDetails.js";
import recieptModel from "../../models/recieptModel.js";
import InputFields from "../../models/recieptModel.js";
// import fs from "fs";

export const addFieldsController = async (req, res) => {
  try {
    const { fieldName, fieldType, required } = req.body;
    switch (true) {
      case !fieldName:
        return res
          .status(500)
          .send({ success: false, message: "Label is required" });
      case !fieldType:
        return res
          .status(500)
          .send({ success: false, message: "Field type is required" });
      case !required:
        return res
          .status(500)
          .send({ success: false, message: "Required field is required" });
    }

    if (fieldName) {
      const result = await recieptModel.findOne({ fieldName: fieldName });
      if (result) {
        return res.status(500).send({
          success: false,
          message: "Already added label",
        });
      }
    }

    const newField = new InputFields({ fieldName, fieldType, required });
    await newField.save();

    await inputDetails.updateMany(
      {},
      { $set: { [`fields.${fieldName}`]: null } }
    );

    res.status(200).send({
      success: false,
      message: "Field added and details schema updated!",
    });
  } catch (error) {
    res.status(500).send({ message: "Error adding field", error });
  }
};
