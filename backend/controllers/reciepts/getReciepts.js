import inputDetails from "../../models/inputDetails.js";

export const getRecieptsController = async (req, res) => {
  try {
    const result = await inputDetails.find();
    if (!result) {
      return res.status(404).send({
        success: false,
        message: "No data found",
      });
    } else {
      return res.status(200).send({
        success: true,
        data: result,
        message: "reciepts getting successfully",
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Error getting reciepts" });
  }
};

export const getSingleRecieptController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await inputDetails.findById(id);
    if (!result) {
      return res.status(404).send({
        success: false,
        message: "No data found",
      });
    } else {
      return res.status(200).send({
        success: true,
        data: result,
        message: "reciept getting successfully",
      });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: "Error getting reciept" });
  }
};
