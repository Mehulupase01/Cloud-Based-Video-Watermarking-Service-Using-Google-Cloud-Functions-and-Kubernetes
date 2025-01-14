//This controller handles the core logic for the watermarking process:

//File Handling:

//Handles two types of requests for video and image inputs:
//File Uploads (multipart data using Multer).
//URLs (using downloadFile function).

// Processing Flow:

// Video and Image Downloading:
// If URLs are provided, downloads the video and image using the downloadFile() function (from downloadFile.js).
// If downloads fail, removes incomplete files.

const path = require('path');
const fs = require('fs');

// Watermarking:
// Calls applyWatermarkToVideo() (from applyWatermark.js) to apply a watermark using ffmpeg.

const { applyWatermarkToVideo, uploadToCloudStorage } = require('../utils/applyWatermark');
const { downloadFile } = require('../utils/downloadFile');
const { publishToPubSub } = require('../utils/publishToPubSub');

// const { publishToPubSub } = require('../utils/publishToPubSub'); // Ensure correct import

exports.applyWatermark = async (req, res) => {
  let videoPath, imagePath;

  try {
    if (req.files && req.files.video && req.files.image) {
      // Handle file uploads
      console.log('Received files:', req.files);
      videoPath = req.files.video[0].path;
      imagePath = req.files.image[0].path;
    } else if (req.body.videoUrl && req.body.imageUrl) {
      // Handle file URLs
      console.log('Received URLs:', req.body);
      const videoUrl = req.body.videoUrl;
      const imageUrl = req.body.imageUrl;

      videoPath = path.join(__dirname, '..', 'uploads', `video_${Date.now()}.mp4`);
      imagePath = path.join(__dirname, '..', 'uploads', `image_${Date.now()}.png`);

      try {
        await downloadFile(videoUrl, videoPath);
        await downloadFile(imageUrl, imagePath);
      } catch (downloadError) {
        console.error('Download error:', downloadError);
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        throw new Error('Failed to download files: ' + downloadError.message);
      }
    } else {
      throw new Error('Either files or URLs must be provided.');
    }



    
    // Define output file path
    const outputFilePath = path.join(__dirname, '..', 'uploads', `watermarked_${Date.now()}.mp4`);
    console.log('Output file path:', outputFilePath);




    // Apply watermark to video

    try {
      console.log('Applying watermark...');
      await applyWatermarkToVideo(videoPath, imagePath, outputFilePath);
      console.log('Watermark applied successfully');
    } catch (applyError) {
      console.error('Error applying watermark:', applyError);
      throw new Error('Failed to apply watermark: ' + applyError.message);
    }

    // Upload to cloud storage
    console.log('Uploading to cloud storage...');
    const url = await uploadToCloudStorage(outputFilePath);
    console.log('Uploaded successfully:', url);




    // Upload and Notification:
    // Uploads the watermarked video to Google Cloud Storage.
    // Publishes a message to a Pub/Sub topic (watermarking) to notify of a successful process.
    
    // Publish to PubSub

    try {
      const topicName = 'watermarking'; // 
      const message = `Video processed and uploaded: ${url}`;
      await publishToPubSub(topicName, message);
      console.log('Message published to PubSub');
    } catch (pubsubError) {
      console.error('Failed to publish message to PubSub:', pubsubError);
    }

    // Clean up temporary files
    [videoPath, imagePath, outputFilePath].forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Deleted local file:', filePath);
      }
    });

// Error Handling:
// Catches and logs any errors during processing.
// Sends back error responses when something fails.

    res.status(200).json({ url });
  } catch (error) {
    console.error('Error in applyWatermark controller:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
