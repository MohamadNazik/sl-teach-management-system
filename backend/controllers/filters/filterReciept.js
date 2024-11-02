import inputDetails from "../../models/inputDetails.js";

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
      codiciId,
      banca,
      benef,
      ordinate,
      causale,
      color,
      fullName,
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
    if (codiciId) {
      filters.push({
        "fields.Codici ID": codiciId,
      });
    }
    if (color) {
      filters.push({
        "fields.color": color,
      });
    }
    if (banca) {
      filters.push({
        "fields.Banca": { $regex: banca, $options: "i" },
      });
    }
    if (benef) {
      filters.push({
        "fields.Benef": { $regex: benef, $options: "i" },
      });
    }
    if (ordinate) {
      filters.push({
        "fields.Ordinate": { $regex: ordinate, $options: "i" },
      });
    }
    if (causale) {
      filters.push({
        "fields.Causale": { $regex: causale, $options: "i" },
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

    if (fullName) {
      filters.push({
        "fields.fullName": { $regex: fullName, $options: "i" },
      });
    }

    const query = { $and: filters };

    const receipts = await inputDetails.find(query);

    if (receipts.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No receipts found.",
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
