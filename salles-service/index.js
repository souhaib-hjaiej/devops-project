import express from 'express';
import cors from 'cors';
import Router from './Routes/roomroutes.js';
import { startConsumer } from './kafka/consumer.js';

const app = express();

// Kafka consumer: listens for reservation events and updates room status
startConsumer()
  .then(() => console.log('✅ Salles-service Kafka consumer started'))
  .catch(err => {
    console.error('❌ Failed to start Kafka consumer in salles-service:', err);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', Router);

const PORT = 3002;
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Salles-service running on port ${PORT}`);
});
