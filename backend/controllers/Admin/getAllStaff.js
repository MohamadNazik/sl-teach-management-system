import admins from "../../models/admins.js";

export const getAllStaff = async (req, res) => {
  try {
    const users = await admins.find({ role: 0 });
    res.status(200).send({
      success: true,
      message: "All staff retrieved successfully",
      users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating staff ID",
      error,
    });
  }
};
