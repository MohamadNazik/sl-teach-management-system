import admins from "../../models/admins.js";

export const deleteStaffController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await admins.findByIdAndDelete(id);
    if (!user) {
      res.status(404).send({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting user",
      error,
    });
  }
};
