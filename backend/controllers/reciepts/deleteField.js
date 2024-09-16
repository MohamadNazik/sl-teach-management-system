import inputDetails from "../../models/inputDetails.js";
import recieptModel from "../../models/recieptModel.js";

export const deleteRecieptController = async (req, res) => {
  try {
    const { fieldName } = req.body;
    if (!fieldName) {
      return res.status(404).send({
        success: false,
        message: "Please provide the field name to delete the reciept",
      });
    }
    const result = await recieptModel.findOne({ fieldName });

    if (!result) {
      return res.status(404).send({
        success: false,
        message: "No field found",
      });
    } else {
      await recieptModel.deleteMany({ fieldName });

      await recieptModel.updateMany(
        {},
        { $unset: { [`fields.${fieldName}`]: "" } }
      );

      res.status(200).send({
        success: true,
        message: "Field deleted and details schema updated!",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error deleting field", error });
  }
};
