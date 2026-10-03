const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middlewares/authMiddleware');

router.use(authenticate);

// Get dashboard statistics (total patients, today's appointments, pending, confirmed)
router.get('/stats', dashboardController.getStats);

module.exports = router;
