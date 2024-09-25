import inputDetails from "../../models/inputDetails.js";

export const updateColorController = async (req, res) => {
  try {
    const { id } = req.params;
    const { color } = req.body;

    const updatedDetail = await inputDetails.findByIdAndUpdate(
      id,
      { $set: { "fields.color": color } },
      { new: true }
    );

    if (!updatedDetail) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({
      message: "Color updated successfully",
      updatedDetail,
    });
  } catch (error) {
    console.error("Error updating color:", error);
    res.status(500).json({ message: "Error updating color", error });
  }
};
