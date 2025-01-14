// This defines the routes for handling watermarking operations:

const express = require('express');

// Dependencies:
// Uses multer for handling file uploads and express for routing.
const multer = require('multer');
const { applyWatermark } = require('../controllers/watermarkController');
const { publishToPubSub } = require('../utils/publishToPubSub');


// Routes:
const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // basically defines the upload directory


// Route for file uploads
// /upload Handles video and image uploads directly from a request using Multer.
router.post('/upload', upload.fields([{ name: 'video' }, { name: 'image' }]), (req, res) => {
  applyWatermark(req, res);
});


// Route for URL uploads
// /upload-url: Handles video and image URLs.
router.post('/upload-url', (req, res) => {
  applyWatermark(req, res);
});


// Route to trigger watermark process
// /trigger-watermark-process: Manually triggers the watermark process and publishes a message to Pub/Sub.

router.post('/trigger-watermark-process', async (req, res) => {
  const { videoPath, imagePath, videoUrl, imageUrl } = req.body;
  const message = JSON.stringify({ videoPath, imagePath, videoUrl, imageUrl });

  try {
    const data = { videoPath, imagePath, videoUrl, imageUrl }
    console.log(data,'datataa')


    // Publish to Pub/Sub
    const topicName = 'watermarking'; 
  
    const messageId = await publishToPubSub(topicName, message);
    res.status(200).json({ messageId, message: 'Watermark process initiated' ,data});
  } catch (error) {
    console.error('Failed to publish message:', error);
    res.status(500).json({ message: 'Failed to initiate watermark process' ,data});
  }
});

module.exports = router;
