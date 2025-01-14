// Handles publishing messages to a Google Cloud Pub/Sub topic:

const { PubSub } = require('@google-cloud/pubsub');

// Initialize PubSub client
// Uses @google-cloud/pubsub to create a client.
const pubsub = new PubSub({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE
});

// Function to publish a message to Pub/Sub
// Publishes a message (as a buffer) to a specified topic and returns the message ID

exports.publishToPubSub = async (topicName, message) => {
  try {
    const dataBuffer = Buffer.from(message); // Ensure message is a string
    const messageId = await pubsub.topic(topicName).publish(dataBuffer);
    console.log(`Message ${messageId} published to topic ${topicName}`);
    return messageId;
  } catch (error) {
    console.error('Error publishing message:', error.message);
    throw new Error(`Failed to publish message: ${error.message}`);
  }
};
