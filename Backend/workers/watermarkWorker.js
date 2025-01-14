const { applyWatermarkToVideo, uploadToCloudStorage } = require('../utils/applyWatermark');

exports.processWatermarkJob = async (job, done) => {
  const { videoPath, imagePath, outputFilePath } = job.data;

  try {
    console.log('Processing job:', job.data);
    await applyWatermarkToVideo(videoPath, imagePath, outputFilePath);
    const gcsUrl = await uploadToCloudStorage(outputFilePath);
    console.log('Job completed successfully:', { gcsUrl });
    done(null, { url: gcsUrl });
  } catch (error) {
    console.error('Error in processWatermarkJob:', error);
    done(error);
  }
};
