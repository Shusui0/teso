import express from 'express';
import pool from './db.js'; // implement pg pool connection
import fetch from 'node-fetch';
import { io } from '../socket.js';


const router = express.Router();


// POST from detector service
router.post('/', async (req, res) => {
try {
const { id, time, violations, evidence_path, lat, lon } = req.body;
// reverse geocode using Nominatim if lat/lon present
let address = null;
if (lat && lon) {
const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
const j = await r.json();
address = j.display_name;
}


// store in DB
const insert = await pool.query(
'INSERT INTO reports(id, time, violations, evidence_path, lat, lon, address) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *',
[id, time, JSON.stringify(violations), evidence_path, lat || null, lon || null, address]
);


const report = insert.rows[0];


// notify clients
io.emit('new-report', report);


res.json(report);
} catch (err) {
console.error(err);
res.status(500).json({error: 'server error'});
}
});


export default router;