import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import admins from "../../models/admins.js";
import bcrypt from "bcrypt";
import UserOTPVerification from "../../models/UserOTPVerification.js";
import nodemailer from "nodemailer";
export const forgotPAsswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await admins.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await sendOTPVerificationEmail(user, res);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in  forgot password",
      error,
    });
  }
};
const otpEmail = process.env.OTP_EMAIL;
const otpPassword = process.env.OTP_PASSWORD;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: otpEmail,
    pass: otpPassword,
  },
});

export const sendOTPVerificationEmail = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailOption = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<p>Enter <b>${otp}</b> to verify your email address and complete the task.</p>
          <p>This code will expire in 5 minutes.</p>`,
    };

    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    const newOTPVerification = new UserOTPVerification({
      staffId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30000,
    });

    await newOTPVerification.save();

    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log("Error while sending email:", err);
        return res.status(500).send({
          success: false,
          message: "Error in sending OTP email",
          error: err,
        });
      }

      res.status(200).send({
        status: "PENDING",
        message: "Verification OTP email sent",
        data: {
          staffId: _id,
          email,
        },
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in OTP",
      error: error.message || error,
    });
  }
};

export const verifyOTPController = async (req, res) => {
  try {
    let { staffId, otp } = req.body;

    if (!staffId || !otp) {
      return res.status(400).send({
        success: false,
        message: "Invalid request",
      });
    } else {
      const UserVerificationOTPRecord = await UserOTPVerification.find({
        staffId: staffId,
      });

      if (UserVerificationOTPRecord.length <= 0) {
        return res.status(404).send({
          success: false,
          message: "User OTP record not found",
        });
      } else {
        const { expiresAt } = UserVerificationOTPRecord[0];
        const hashedOTP = UserVerificationOTPRecord[0].otp;

        if (expiresAt < Date.now()) {
          await UserOTPVerification.deleteMany({ staffId });
          return res.status(400).send({
            success: false,
            message: "OTP has expired",
          });
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP) {
            return res.status(404).send({
              success: false,
              message: "Invalid OTP,Check Your inbox",
            });
          } else {
            await admins.updateOne({ _id: staffId }, { verified: true });
            await UserOTPVerification.deleteMany({ staffId });
            return res.status(200).send({
              success: true,
              message: "OTP verified successfully",
            });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in OTP",
      error: error.message || error,
    });
  }
};

export const resendOTPController = async (req, res) => {
  try {
    let { staffId, email } = req.body;

    if (!staffId || !email) {
      return res.status(400).send({
        success: false,
        message: "Please provide staffId and email",
      });
    } else {
      await UserOTPVerification.deleteMany({ staffId });
      sendOTPVerificationEmail({ _id: staffId, email }, res);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in OTP",
      error: error.message || error,
    });
  }
};
export const resetPasswordController = async (req, res) => {
  try {
    const { staffId, newPassword, confirmPassword } = req.body;

    if (!staffId || !newPassword || !confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Please provide staffId, newPassword, and confirmPassword",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const user = await admins.findOne({ _id: staffId });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (!user.verified) {
      return res.status(400).send({
        success: false,
        message: "User is not verified. Please verify with OTP first.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await admins.updateOne({ _id: staffId }, { password: hashedPassword });

    return res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error resetting password",
      error: error.message || error,
    });
  }
};
