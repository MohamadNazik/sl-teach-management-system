import Favourite from "../../models/favourite.js";
import inputDetails from "../../models/inputDetails.js";

export const deleteRecieptController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await inputDetails.findById(id);
    if (!result) {
      return res.status(404).send({
        success: false,
        message: "No data found to delete",
      });
    }
    await Favourite.deleteOne({ recieptId: id });
    await inputDetails.findByIdAndDelete(id);

    return res.status(200).send({
      success: true,
      data: result,
      message: "Receipt deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting receipt",
    });
  }
};
