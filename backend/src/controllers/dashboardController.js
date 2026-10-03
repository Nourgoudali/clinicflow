const dashboardService = require('../services/dashboardService');

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats
};
