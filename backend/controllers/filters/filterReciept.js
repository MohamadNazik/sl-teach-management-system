import inputDetails from "../../models/inputDetails.js"; // Your model

export const getFilters = async (req, res) => {
  try {
    const {
      month,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      startTime,
      endTime,
      startCodiciId,
      endCodiciId,
    } = req.body;

    let filters = [];

    if (month) {
      const formattedMonth = month.padStart(2, "0");
      const regex = new RegExp(`^\\d{4}-${formattedMonth}-\\d{2}$`);
      filters.push({ "fields.Date": { $regex: regex } });
    }

    if (startDate && endDate) {
      filters.push({
        "fields.Date": {
          $gte: startDate,
          $lte: endDate,
        },
      });
    }
    if (startTime && endTime) {
      filters.push({
        "fields.Time": {
          $gte: startTime,
          $lte: endTime,
        },
      });
    }
    if (startCodiciId && endCodiciId) {
      filters.push({
        "fields.Codici ID": {
          $gte: startCodiciId,
          $lte: endCodiciId,
        },
      });
    }

    if (minPrice && maxPrice) {
      filters.push({
        "fields.price": {
          $gte: minPrice,
          $lte: maxPrice,
        },
      });
    }

    if (filters.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No filters provided",
      });
    }

    const query = filters.length > 0 ? { $and: filters } : {};

    const receipts = await inputDetails.find(query);
    console.log(receipts);

    if (receipts.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No receipts found",
      });
    }

    res.status(200).send({
      success: true,
      receipts,
      message: "Receipts filtered successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Server error.",
    });
  }
};
