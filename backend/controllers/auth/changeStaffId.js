import { comparePassword } from "../../middlewares/authMiddleware.js";
import admins from "../../models/admins.js";

export const changeStaffIdController = async (req, res) => {
  try {
    const { currentStaffId, newStaffId, password } = req.body;

    if (!currentStaffId || !newStaffId || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide current staff ID, new staff ID, and password",
      });
    }

    const user = await admins.findOne({ staffId: currentStaffId });
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

    const existingUser = await admins.findOne({ staffId: newStaffId });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message:
          "The new staff ID is already taken. Please choose another one.",
      });
    }

    user.staffId = newStaffId;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Staff ID updated successfully",
      user: {
        staffId: user.staffId,
        _id: user._id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating staff ID",
      error,
    });
  }
};
// export const changeUserNameController = async (req, res) => {
//   try {
//     const { currentUsername, newUserName, password } = req.body;

//     if (!currentUsername || !newUserName || !password) {
//       res.status(400).send({
//         success: false,
//         message: "Please provide current Username, new Username, and password",
//       });
//     } else {
//       const user = await admins.findOne({ name: currentUsername });
//       if (!user) {
//         res.status(404).send({
//           success: false,
//           message: "User with the given Username not found",
//         });
//         const isMatch = await comparePassword(password, user.password);
//         if (!isMatch) {
//           res.status(401).send({
//             success: false,
//             message: "Incorrect password",
//           });
//         }
//         const existingUser = await admins.findOne({ name: newUserName });
//         if (existingUser) {
//           res.status(400).send({
//             success: false,
//             message: "Username already exists",
//           });
//         }
//         const updatedUser = await admins.updateOne(
//           { name: currentUsername },
//           { name: newUserName }
//           //   { new: true }
//         );
//         res.status(200).send({
//           success: true,
//           message: "Username updated successfully",
//           updatedUser,
//         });
//       }
//     }
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Error in changing user name",
//       error,
//     });
//   }
// };
