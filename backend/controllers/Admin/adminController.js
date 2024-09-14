import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import admins from "../../models/admins.js";

export const adminLoginController = async (req, res) => {
  try {
    const { staffId, password } = req.body;

    if (!staffId || !password) {
      return res.status(400).send({
        success: false,
        message: "Please fill all fields",
      });
    }

    const user = await admins.findOne({ staffId });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Staff ID",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = JWT.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Send back the token and user info
    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        staffId: user.staffId,
        name: user.name,
        role: user.role,
      },
      token, // Return the JWT token here
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};
