import inputDetails from "../../models/inputDetails.js";
import recieptModel from "../../models/recieptModel.js";
import InputFields from "../../models/recieptModel.js";
// import fs from "fs";

export const addFieldsController = async (req, res) => {
  try {
    const { fieldName, fieldType, required } = req.body;
    switch (true) {
      case !fieldName:
        return res
          .status(500)
          .send({ success: false, message: "Label is required" });
      case !fieldType:
        return res
          .status(500)
          .send({ success: false, message: "Field type is required" });
      case !required:
        return res
          .status(500)
          .send({ success: false, message: "Required field is required" });
    }

    if (fieldName) {
      const result = await recieptModel.findOne({ fieldName: fieldName });
      if (result) {
        return res.status(500).send({
          success: false,
          message: "Already added label",
        });
      }
    }

    const newField = new InputFields({ fieldName, fieldType, required });
    await newField.save();

    await inputDetails.updateMany(
      {},
      { $set: { [`fields.${fieldName}`]: null } }
    );

    res.status(200).send({
      success: false,
      message: "Field added and details schema updated!",
    });
  } catch (error) {
    res.status(500).send({ message: "Error adding field", error });
  }
  //   try {
  //     const {
  //       fullName,
  //       email,
  //       phone,
  //       dateOfBirth,
  //       meetingDate,
  //       startTime,
  //       endTime,
  //     } = req.fields;

  //     const { resume, profilePhoto, documentUpload } = req.files;

  //     switch (true) {
  //       case !fullName:
  //         return res.status(500).send({ error: "Full Name is Required" });
  //       case !email:
  //         return res.status(500).send({ error: "Email is Required" });
  //       case !phone:
  //         return res.status(500).send({ error: "Phone number is Required" });
  //       case !dateOfBirth:
  //         return res.status(500).send({ error: "Date of Birth is Required" });
  //       case !meetingDate:
  //         return res.status(500).send({ error: "Meeting date is Required" });
  //       case !startTime:
  //         return res.status(500).send({ error: "Start time is Required" });
  //       case !endTime:
  //         return res.status(500).send({ error: "End time is Required" });
  //       case profilePhoto && profilePhoto.size > 1000000:
  //         return res.status(500).send({
  //           error: "Profile photo is Required and should be less then 1mb",
  //         });
  //       case resume && resume.size > 1000000:
  //         return res
  //           .status(500)
  //           .send({ error: "resume is Required and should be less then 1mb" });
  //       case documentUpload && documentUpload.size > 1000000:
  //         return res
  //           .status(500)
  //           .send({ error: "document is Required and should be less then 1mb" });
  //     }
  //     const reciepts = new InputFields({ ...req.fields });
  //     if (profilePhoto) {
  //       reciepts.profilePhoto.data = fs.readFileSync(profilePhoto.path);
  //       reciepts.profilePhoto.contentType = profilePhoto.type;
  //     }
  //     if (resume) {
  //       reciepts.resume.data = fs.readFileSync(resume.path);
  //       reciepts.resume.contentType = resume.type;
  //     }
  //     if (documentUpload) {
  //       reciepts.documentUpload.data = fs.readFileSync(documentUpload.path);
  //       reciepts.documentUpload.contentType = documentUpload.type;
  //     }

  //     await reciepts.save();
  //     res.status(200).send({
  //       message: "Input Fields saved successfully",
  //       data: reciepts,
  //       success: true,
  //     });
  //   } catch (error) {
  //     res.status(500).send({
  //       success: false,
  //       message: "Error creating reciept",
  //       error,
  //     });
  //   }
};
