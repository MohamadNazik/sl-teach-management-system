import Favourite from "../../models/favourite.js";
import inputDetails from "../../models/inputDetails.js";

export const addFavouriteController = async (req, res) => {
  try {
    const { userId, recieptId } = req.body;

    const existingFavourite = await Favourite.findOne({ userId, recieptId });

    if (existingFavourite) {
      return res.status(400).json({
        success: false,
        message: "Receipt is already in your favorites",
      });
    }

    const newFavourite = new Favourite({ userId, recieptId });
    await newFavourite.save();

    res.status(201).json({
      success: true,
      message: "Receipt added to favorites successfully",
      favourite: newFavourite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding to favorites",
      error,
    });
  }
};

export const removeFavouriteController = async (req, res) => {
  try {
    const { userId, recieptId } = req.body;

    const favourite = await Favourite.findOneAndDelete({
      userId,
      recieptId,
    });

    if (!favourite) {
      return res.status(404).json({
        success: false,
        message: "Favourite not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Favourite removed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error removing favourite",
      error,
    });
  }
};

export const getFavouritesController = async (req, res) => {
  try {
    const { userId } = req.params;

    const favourites = await Favourite.find({ userId });

    if (!favourites || favourites.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No favourites found",
      });
    }

    const favouriteReceipts = await Promise.all(
      favourites.map(async (fav) => {
        const receipt = await inputDetails.findById(fav.recieptId);

        return receipt || null;
      })
    );

    const validReceipts = favouriteReceipts.filter(
      (receipt) => receipt !== null
    );

    if (validReceipts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No valid favourites found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Favourites fetched successfully",
      data: validReceipts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching favourites",
      error,
    });
  }
};
