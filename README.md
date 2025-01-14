# Cloud-Based Video Watermarking Service Using Google Cloud Functions and Kubernetes
 This project implements a cloud-based video watermarking service utilizing Google Cloud Functions and Google Kubernetes Engine (GKE). It compares serverless and containerized architectures for video processing, analyzing performance, cost-efficiency, and scalability to find the optimal solution for watermarking tasks

# Watermarking as a Service: Cloud-Based Video Processing with Google Cloud Functions and Google Kubernetes Engine (GKE)

This project implements a **video watermarking service** leveraging **Google Cloud Platform (GCP)**, with the ability to apply watermarks to videos and make use of **Cloud Functions** and **Kubernetes Engine** to handle video processing in parallel. The backend is built using **Node.js** and experiments are performed to evaluate the trade-offs between serverless (Google Cloud Functions) and containerized (Google Kubernetes Engine) backends.

## Project Overview

In this project, a **React-based frontend** allows users to upload videos and watermark images, while the **backend** performs video processing tasks like decomposing the video into frames, applying the watermark, and reassembling the video. The backend is deployed using two different architectures for comparative analysis:

1. **Google Cloud Functions (Serverless)**: Ideal for scaling to handle small and intermittent workloads with low latency.
2. **Google Kubernetes Engine (GKE)**: A containerized approach, better suited for sustained workloads requiring resource control and horizontal scaling.

The main objective is to perform a **comparison of performance** and **cost-efficiency** between these two approaches for video watermarking tasks.

## Architecture

### Frontend:
- **React Web Application**: Provides a user interface for uploading videos, watermark images, tracking processing status, and downloading processed videos.
- **Firebase Hosting**: The frontend is hosted on **Firebase** for secure and efficient delivery.

### Backend:
- **Node.js**: Handles video processing tasks such as watermarking using **FFmpeg** for video manipulation.
- **Google Cloud Functions**: A serverless solution for processing video watermarking tasks.
- **Google Kubernetes Engine (GKE)**: Manages containerized applications, offering scalable compute resources.
- **Google Cloud Storage**: Stores video files and watermark images, ensuring scalability and durability.

### Communication:
- **Pub/Sub Messaging**: Manages the distribution of video processing tasks and tracks the status of the jobs.
  
### System Workflow:
1. **Video Upload**: Users upload videos or provide a video URL for processing.
2. **Task Assignment**: Tasks are distributed among backend workers using **Pub/Sub** messaging.
3. **Watermarking**: Each worker applies a watermark to the video frames.
4. **Result Composition**: Processed frames are reassembled into the final video and stored in **Google Cloud Storage**.
5. **Download Link**: Once the watermarking process is complete, users can download the video.

## Ensure you have the following services enabled in your Google Cloud Platform project:
- Google Cloud Functions
- Google Kubernetes Engine
- Google Cloud Storage
- Google Pub/Sub

## Deployment

### Frontend Deployment (Firebase Hosting)

1. **Install Firebase CLI**:
   ```bash

   npm install -g firebase-tools

  ```

2. **Login to Firebase**:
   ```bash

    firebase login

  ```

3. **Deploy the frontend: Build the frontend and deploy it to Firebase**:
   ```bash

   npm run build
   firebase deploy

  ```

## Backend Deployment

### Using Google Cloud Functions (Serverless)

  1. **Authenticate with Google Cloud SDK**:
     ```bash

      gcloud auth login

    ```

  2. **Deploy Cloud Function**:

     ```bash

      gcloud functions deploy watermark-service --runtime nodejs18 --trigger-http

    ```

### Using Google Kubernetes Engine (Containerized)

  1. **Build Docker Image**:
     ```bash

      docker build -t watermark-service 

    ```

  2. **Push Docker Image to Google Container Registry**:

     ```bash

      docker tag watermark-service gcr.io/[PROJECT-ID]/watermark-service:latest
      docker push gcr.io/[PROJECT-ID]/watermark-service:latest

    ```

  3. **Deploy to GKE: Apply the deployment.yaml and ingress.yaml configuration files**:

     ```bash

        kubectl apply -f deployment.yaml
        kubectl apply -f ingress.yaml

   ```


## Configuring DNS

To configure the domain (e.g., `alphamatrix.linkpc.net`) to point to the IP address of your GKE ingress, create an **A record** with your DNS provider.

## Experiments and Results

### Comparative Metrics

The experiments focus on comparing **Google Cloud Functions** and **Google Kubernetes Engine** based on:
1. **Processing Time**: Time taken to apply a watermark to a video.
2. **Resource Utilization**: CPU and memory consumption during video processing.
3. **Cost Efficiency**: Cost of processing based on GCP's pricing for Cloud Functions and GKE.

| Metric                      | Google Cloud Functions | Google Kubernetes Engine |
|-----------------------------|------------------------|--------------------------|
| **Processing Time (5-min video)** | 380-420 sec            | 420-470 sec              |
| **Cost**                     | $4.95                  | $10.41                   |
| **Resource Utilization**     | Low (auto-scaling)     | High (manual scaling)    |

### Key Findings:
- **Google Cloud Functions** performs better for small workloads, with lower processing time and better cost-efficiency.
- **Google Kubernetes Engine** is better suited for sustained larger workloads, offering more control over resources but at a higher cost.

## Conclusion

This project demonstrated the advantages and trade-offs between **serverless** and **containerized** architectures for cloud-based video watermarking. **Google Cloud Functions** excels for quick, low-latency tasks, while **Google Kubernetes Engine** offers more flexibility and control for larger, more sustained workloads. Based on the experimental results, the choice between the two approaches depends on the specific workload requirements and cost considerations.

## Future Work
- **Load Balancing Optimization**: Improved algorithms for more efficient resource allocation.
- **Machine Learning Integration**: Implement dynamic scaling and video chunk sizing using machine learning.
- **Enhanced Security**: Implement better encryption and authentication mechanisms for video files.
- **User Experience Enhancements**: Implement real-time progress bars and better UI for easier video uploads.

## References:
1. **Google Cloud Platform Documentation**: [https://cloud.google.com/docs](https://cloud.google.com/docs)
2. **FFmpeg**: [https://ffmpeg.org](https://ffmpeg.org)
3. **Docker Documentation**: [https://docs.docker.com](https://docs.docker.com)
4. **Google Kubernetes Engine (GKE)**: [https://cloud.google.com/kubernetes-engine](https://cloud.google.com/kubernetes-engine)
5. **Firebase Hosting**: [https://firebase.google.com/docs/hosting](https://firebase.google.com/docs/hosting)
