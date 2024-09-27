import recieptModel from "../../models/recieptModel.js";

export const getAllFieldController = async (req, res) => {
  try {
    const fields = await recieptModel.find();
    if (!fields) {
      return res.status(404).send({
        message: "No fields found",
        success: false,
      });
    } else {
      res.status(200).send({
        message: "Fields found",
        success: true,
        fields: fields,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error getting field", error });
  }
};
