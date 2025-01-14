// Importing core modules like express, dotenv, and serverless for routing, 
// environment management, and serverless deployment, respectively.

const express = require("express");
const dotenv = require("dotenv");
const serverless = require("serverless-http");
const cors = require("cors");

dotenv.config(); //Loads environment variables using dotenv.config().

const app = express();
const watermarkRoutes = require("./routes/watermark");


// Allow all CORS requests 
// Sets up CORS policy to allow requests from all origins, and provides methods like GET, POST, DELETE, etc.
app.use(cors({
  origin: '*', // This allows all origins
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: 'X-Requested-With,content-type,Authorization'
}));


// Route Handling
// Sets up routes under /api/watermark, using the watermarkRoutes module from the routes folder.
app.use(express.json());
app.use('/api/watermark', watermarkRoutes);



// Error handling middleware
// Defines an error-handling middleware that responds with a 500 status code and logs errors to the console.

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});



// Local development server
// The server listens on a port specified by the environment if NODE_ENV is not set to production.
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for serverless deployment
// Exports the Express app wrapped in serverless() for serverless deployment purposes.
module.exports = { app: serverless(app) };
