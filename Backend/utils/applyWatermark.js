// This module contains the logic for adding the watermark to a video and uploading to Google Cloud Storage:


// Watermark Application:
const ffmpeg = require('fluent-ffmpeg');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
if (!bucketName) {
  throw new Error('A bucket name is needed to use Cloud Storage.');
}
const bucket = storage.bucket(bucketName);



// Function to apply watermark to video
// Uses fluent-ffmpeg to overlay the image watermark onto the video at the center.
// Configures output options like codec (libx264), compression quality (crf 18), and speed (preset veryfast).

exports.applyWatermarkToVideo = (videoPath, imagePath, outputFilePath) => {
  return new Promise((resolve, reject) => {
    console.log('Starting video processing:', { videoPath, imagePath, outputFilePath });

    ffmpeg(videoPath)
      .input(imagePath)
      .complexFilter([
        '[1:v]scale=iw:ih[wm];' +
        '[wm]format=rgba,colorchannelmixer=aa=0.5[wm_trans];' +
        '[0:v][wm_trans]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2'
      ])
      .outputOptions(['-c:v libx264', '-crf 18', '-preset veryfast'])
      .output(outputFilePath)
      .on('end', () => {
        console.log('Video processing completed:', outputFilePath);
        resolve(outputFilePath); 
      })
      .on('error', (err) => {
        console.error('Error during video processing:', err.message);
        reject(new Error(`FFmpeg failed: ${err.message}`));
      })
      .run();
  });
};



// Function to upload video to Google Cloud Storage
// Initializes Google Cloud Storage using @google-cloud/storage and credentials from the environment.

exports.uploadToCloudStorage = async (filePath) => {
  try {
    const destination = path.basename(filePath);
    console.log('Uploading to Cloud Storage:', filePath);

    await bucket.upload(filePath, { destination });

    const publicUrl = `https://${bucket.name}.storage.googleapis.com/${destination}`;
    console.log('File uploaded successfully:', publicUrl);



    // Delete the local file after successful upload
    Uploads the processed file and deletes it locally afterward.
    fs.unlinkSync(filePath);
    console.log('Local file deleted:', filePath);

    return publicUrl; 
  } catch (err) {
    console.error('Error during file upload:', err.message);
    throw new Error(`Cloud Storage upload failed: ${err.message}`);
  }
};
