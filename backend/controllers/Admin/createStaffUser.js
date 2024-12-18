import admins from "../../models/admins.js";
import bcrypt from "bcrypt";

export const createStaffUserController = async (req, res) => {
  try {
    const { name, staffId, email, password, confirmPassword } = req.body;

    if (!name) {
      return res.status(500).send({ error: "Name is Required" });
    }
    if (!staffId) {
      return res.status(500).send({ error: "Staff ID is Required" });
    }
    if (!email) {
      return res.status(500).send({ error: "Email is Required" });
    }
    if (!password) {
      return res.status(500).send({ error: "Password is Required" });
    }
    if (!confirmPassword) {
      return res.status(500).send({ error: "Confirm Password is Required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    const existingUser = await admins.findOne({ staffId: staffId });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Staff ID already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = new admins({
      name,
      staffId,
      email,
      password: hashedPassword,
      role: 0,
    });

    await staff.save();

    res.status(200).send({
      success: true,
      message: "Staff created successfully",
      staff,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error creating staff user",
      error,
    });
  }
};
