import { comparePassword } from "../../middlewares/authMiddleware.js";
import admins from "../../models/admins.js";
import bcrypt from "bcrypt";

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { id } = req.params;
    const admin = await admins.findById(id);

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .send({ success: false, message: "Please fill all fields" });
    } else {
      const isMatch = await comparePassword(oldPassword, admin.password);
      if (!isMatch) {
        return res.status(400).send({
          success: false,
          message: "Old password is incorrect",
        });
      } else {
        if (newPassword !== confirmPassword) {
          return res.status(400).send({
            success: false,
            message: "Passwords do not match",
          });
        } else {
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          const user = await admins.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
          );
          return res.status(200).send({
            success: true,
            message: "Password changed successfully",
          });
        }
      }
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error change password",
      error,
    });
  }
};
