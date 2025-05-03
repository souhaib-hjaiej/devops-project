import db from '../config/db.js';
import { sendMessage } from '../kafka/producer.js'; // Import Kafka producer

// Create reservation
export const createReservation = (req, res) => {
  const { salle_id, user_id, start_date, end_date, status } = req.body;

  db.query(
    'INSERT INTO reservation (salle_id, user_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
    [salle_id, user_id, start_date, end_date, status],
    async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const reservation = {
        id: result.insertId,
        salle_id,
        user_id,
        start_date,
        end_date,
        status
      };

      // Send the reservation to Kafka
      await sendMessage(reservation);  // Send message to Kafka

      res.status(201).json({ message: 'Reservation created', reservation });
    }
  );
};

// Get all reservations
export const getAllReservations = (req, res) => {
  db.query('SELECT * FROM reservation', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ reservations: results });
  });
};

// Get reservation by ID
export const getReservationById = (req, res) => {
  const { id } = req.body;

  db.query('SELECT * FROM reservation WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Réservation non trouvée' });
    res.status(200).json({ reservation: results[0] });
  });
};

// Update a reservation
export const updateReservation = (req, res) => {
  const { id, salle_id, user_id, start_date, end_date, status } = req.body;

  db.query(
    'UPDATE reservation SET salle_id = ?, user_id = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?',
    [salle_id, user_id, start_date, end_date, status, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Réservation non trouvée' });
      res.status(200).json({ message: 'Réservation mise à jour' });
    }
  );
};

// Delete a reservation
export const deleteReservation = (req, res) => {
  const { id } = req.body;

  db.query('DELETE FROM reservation WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Réservation non trouvée' });
    res.status(200).json({ message: 'Réservation supprimée' });
  });
};
