import express from 'express';
import { 
  createSalle, 
  getAllSalles, 
  getSalleById, 
  updateSalle, 
  deleteSalle 
} from '../controleurs/salles.js';

const router = express.Router();

// Create a salle
router.post('/create', createSalle);

// Get all salles
router.get('/all', getAllSalles);

// Get one salle by ID
router.post('/one', getSalleById);

// Update a salle
router.post('/update', updateSalle);

// Delete a salle
router.post('/delete', deleteSalle);

export default router;
