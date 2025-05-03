import express from 'express';
import cors from 'cors';
import Router from './Routes/usersroutes.js';  // Ensure the path is correct

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/', Router);

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
