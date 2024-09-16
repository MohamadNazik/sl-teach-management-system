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
