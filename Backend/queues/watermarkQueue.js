const Queue = require('bull');
const { processWatermarkJob } = require('../workers/watermarkWorker');

// This file sets up a job queue using Bull:

// Queue Initialization:
// Creates a new queue called watermarkQueue, connected to a Redis instance running on 127.0.0.1:6379.

const watermarkQueue = new Queue('watermarkQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
});

// Job Processing:
// The queue is set to process jobs using the processWatermarkJob() function, defined in a worker module.

watermarkQueue.process(processWatermarkJob);

module.exports = watermarkQueue;
