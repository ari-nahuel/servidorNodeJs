const express = require('express');
const router = express.Router();
const db = require('../databaseConexion');

router.get('/admin', (req, res) => {
  if (!req.session.authenticated) return res.redirect('/login');

  db.all('SELECT * FROM mensajes ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.send('Error al cargar mensajes');
    res.render('admin', { mensajes: rows });
  });
});
//aca pone la ruta para recuibir el POST del formulario 
router.post('/api/contacto', (req, res) => {
  const { nombre, correo, asunto, mensaje } = req.body;

  if (!nombre || !correo || !mensaje) {
    return res.status(400).json({ error: "Campos requeridos incompletos" });
  }

  db.run(`
    INSERT INTO mensajes (nombre, correo, asunto, mensaje)
    VALUES (?, ?, ?, ?)
  `, [nombre, correo, asunto, mensaje], function(err) {
    if (err) return res.status(500).json({ error: 'Error al guardar el mensaje' });
    res.json({ success: true, message: 'Mensaje guardado correctamente' });
  });
});

module.exports = router;
