import { comparePassword } from "../../middlewares/authMiddleware.js";
import admins from "../../models/admins.js";

export const changeUsernameController = async (req, res) => {
  try {
    const { currentUsername, newUsername, password } = req.body;

    if (!currentUsername || !currentUsername || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide current staff ID, new staff ID, and password",
      });
    }

    const user = await admins.findOne({ name: currentUsername });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User with the given staff ID not found",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Incorrect password",
      });
    }

    const existingUser = await admins.findOne({ name: newUsername });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message:
          "The new staff ID is already taken. Please choose another one.",
      });
    }

    user.name = newUsername;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Staff ID updated successfully",
      user: {
        name: user.name,
        _id: user._id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating username",
      error,
    });
  }
};
