import admins from "../../models/admins.js";

export const getAllStaff = async (req, res) => {
  try {
    const user = await admins.find({ role: 0 });
    res.status(200).send({
      status: true,
      message: "All staff retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating staff ID",
      error,
    });
  }
};
