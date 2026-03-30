const AtsHistory = require("../models/atsHistory");

exports.getAtsHistory = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const history = await AtsHistory.findOne({ userId });
    
    if (!history) {
      return res.status(200).json({ success: true, history: [] });
    }

    res.status(200).json({ success: true, history: history.atsScores });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
