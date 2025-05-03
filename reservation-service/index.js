import express from 'express';
import cors from 'cors';
import Router from './Routes/reservationroutes.js';
import { connectProducer } from './kafka/producer.js';

const app = express();

// Kafka producer: connect before handling any requests
connectProducer()
  .then(() => console.log('✅ Reservation-service Kafka producer connected'))
  .catch(err => {
    console.error('❌ Failed to connect Kafka producer in reservation-service:', err);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/reservations', Router); // Prefixing the routes for better structure

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Reservation-service running on port ${PORT}`);
});
