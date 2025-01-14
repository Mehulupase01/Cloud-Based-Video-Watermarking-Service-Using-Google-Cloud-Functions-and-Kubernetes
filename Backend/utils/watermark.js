const express = require('express');
const router = express.Router();
const { applyWatermark } = require('../controllers/watermarkController');

router.post('/trigger-watermark-process', applyWatermark);

module.exports = router;
