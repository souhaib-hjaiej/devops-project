import express from 'express';
import { 
  createReservation, 
  getAllReservations, 
  getReservationById, 
  updateReservation, 
  deleteReservation 
} from '../controleurs/reservation.js';

const router = express.Router();

// Routes using POST for CRUD operations
router.post('/create', createReservation); // Create a reservation
router.get('/get-all', getAllReservations); // Get all reservations
router.get('/get', getReservationById); // Get reservation by ID
router.put('/update', updateReservation); // Update a reservation
router.delete('/delete', deleteReservation); // Delete a reservation

export default router;
