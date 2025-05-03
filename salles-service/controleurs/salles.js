import db from '../config/db.js';

export const createSalle = (req, res) => {
  const { numero_salle, type_salle, etat, prix, description } = req.body;

  db.query(
    'INSERT INTO salles (numero_salle, type_salle, etat, prix, description) VALUES (?, ?, ?, ?, ?)',
    [numero_salle, type_salle, etat, prix, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Salle créée', salleId: result.insertId });
    }
  );
};

export const getAllSalles = (req, res) => {
  db.query('SELECT * FROM salles', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ salles: results });
  });
};

export const getSalleById = (req, res) => {
  const { id } = req.body;

  db.query('SELECT * FROM salles WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Salle non trouvée' });
    res.status(200).json({ salle: results[0] });
  });
};

export const updateSalle = (req, res) => {
  const { id, numero_salle, type_salle, etat, prix, description } = req.body;

  db.query(
    'UPDATE salles SET numero_salle = ?, type_salle = ?, etat = ?, prix = ?, description = ? WHERE id = ?',
    [numero_salle, type_salle, etat, prix, description, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Salle non trouvée' });
      res.status(200).json({ message: 'Salle mise à jour' });
    }
  );
};

export const deleteSalle = (req, res) => {
  const { id } = req.body;

  db.query('DELETE FROM salles WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Salle non trouvée' });
    res.status(200).json({ message: 'Salle supprimée' });
  });
};
