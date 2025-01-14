import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [video, setVideo] = useState(null);
  const [image, setImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [backendVideoUrl, setBackendVideoUrl] = useState(null);
  const [status, setStatus] = useState('');
  const [backendUrl, setBackendUrl] = useState('');

  const handleFileUpload = async () => {
    if (!backendUrl) {
      setStatus('Please select a backend');
      return;
    }

    setStatus('Uploading files...');
    const formData = new FormData();
    formData.append('video', video);
    formData.append('image', image);

    try {
      const uploadResponse = await axios.post(`${backendUrl}/api/watermark/upload`, formData);
      setBackendVideoUrl(uploadResponse.data);
      triggerWatermarkProcess({
        videoPath: uploadResponse.data.videoPath,
        imagePath: uploadResponse.data.imagePath,
      });
    } catch (error) {
      setStatus('Error uploading files');
    }
  };

  const handleUrlUpload = async () => {
    if (!backendUrl) {
      setStatus('Please select a backend');
      return;
    }

    setStatus('Uploading URLs...');
    try {
      const uploadResponse = await axios.post(`${backendUrl}/api/watermark/upload-url`, {
        videoUrl,
        imageUrl,
      });
      triggerWatermarkProcess({ videoUrl, imageUrl });
    } catch (error) {
      setStatus('Error uploading URLs');
    }
  };

  const triggerWatermarkProcess = async (data) => {
    if (!backendUrl) {
      setStatus('Please select a backend');
      return;
    }

    setStatus('Applying watermark...');
    try {
      const response = await axios.post(`${backendUrl}/api/watermark/trigger-watermark-process`, data);
      setResultUrl(response.data.url || response.data.resultUrl || response.data.fileUrl);
      setStatus('Watermark applied successfully');
    } catch (error) {
      setStatus('Failed to apply watermark');
    }
  };

  const handleBackendChange = (event) => {
    setBackendUrl(event.target.value);
    setStatus(''); // Clear status when backend is changed
  };

  return (
    <div style={styles.appContainer}>
      <h1 style={styles.appTitle}>🌟 Video Watermarking Service 🌟</h1>

      <div style={styles.backendSelection}>
        <label>
          <strong>Select Backend:</strong>
          <select onChange={handleBackendChange} style={styles.selectInput}>
            <option value="">Select a backend</option>
            <option value="https://us-central1-watermark1234.cloudfunctions.net/watermarkservice2">
              Google Cloud Functions
            </option>
            <option value="https://alphamatrix.linkpc.net">
              Google Kubernetes Engine
            </option>
          </select>
        </label>
      </div>

      <div style={styles.uploadSection}>
        <h2 style={styles.sectionTitle}>Upload Files</h2>
        <div style={styles.fileInputs}>
          <label>
            <strong>Video:</strong>
            <input type="file" onChange={(e) => setVideo(e.target.files[0])} style={styles.fileInput} />
          </label>
          <label>
            <strong>Image:</strong>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} style={styles.fileInput} />
          </label>
        </div>
        <button
          onClick={handleFileUpload}
          style={styles.uploadButton}
          disabled={!video || !image || !backendUrl}
        >
          Upload
        </button>
      </div>

      <div style={styles.urlSection}>
        <h2 style={styles.sectionTitle}>Or Provide URLs</h2>
        <input
          type="text"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={styles.urlInput}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={styles.urlInput}
        />
        <button
          onClick={handleUrlUpload}
          style={styles.uploadButton}
          disabled={!videoUrl || !imageUrl || !backendUrl}
        >
          Submit
        </button>
      </div>

      {status && <p style={styles.statusMessage}>{status}</p>}

      {resultUrl && (
        <div style={styles.resultSection}>
          <h2>Watermarked Video</h2>
          <video controls src={resultUrl} width="600" style={styles.videoPlayer}></video>
          <div>
            <a href={resultUrl} download="watermarked_video.mp4">
              <button style={styles.downloadButton}>Download Video</button>
            </a>
          </div>
        </div>
      )}

      {backendVideoUrl && (
        <div style={styles.resultSection}>
          <h2>Backend Video</h2>
          <video controls src={backendVideoUrl.url} width="600" style={styles.videoPlayer}></video>
          <div>
            <a href={backendVideoUrl.url} download="backend_video.mp4">
              <button style={styles.downloadButton}>Download Video</button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  appTitle: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '20px',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  backendSelection: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#555',
    marginBottom: '10px',
  },
  fileInputs: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '10px',
  },
  fileInput: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  urlSection: {
    marginBottom: '30px',
  },
  urlInput: {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  uploadButton: {
    display: 'inline-block',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.3s ease',
    marginTop: '20px',
  },
  statusMessage: {
    marginTop: '20px',
    fontSize: '1.2rem',
    color: '#f093fb',
  },
  resultSection: {
    marginTop: '30px',
    textAlign: 'center',
  },
  videoPlayer: {
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
  },
  downloadButton: {
    background: '#28a745',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.3s ease',
  },
  selectInput: {
    padding: '10px',
    borderRadius: '10px',
    fontSize: '1rem',
    border: '1px solid #ddd',
  },
};

export default App;

