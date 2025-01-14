// Provides a utility function to download files using https:

const https = require('https');
const fs = require('fs');

// Function: Downloads a file from a given URL and saves it to the specified filePath.
// Error Handling: Deletes the file if an error occurs during downloading.
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(filePath);
      reject(err);
    });
  });
}

module.exports = { downloadFile };
