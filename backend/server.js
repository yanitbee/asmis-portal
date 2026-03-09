import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { initDb, query } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database
initDb();

// --- Public Routes ---

// Register Applicant
app.post('/api/register', async (req, res) => {
    const { role, full_name, email, country, organization, social_handle } = req.body;
    try {
        const result = await query(
            'INSERT INTO applicants (role, full_name, email, country, organization, social_handle) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [role, full_name, email, country, organization, social_handle]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed. Email might already exist.' });
    }
});

// --- Admin Routes (Simplified for Demo) ---

// Get All Applicants
app.get('/api/admin/applicants', async (req, res) => {
    try {
        const { role, country } = req.query;
        let sql = 'SELECT * FROM applicants WHERE status != $1';
        const params = ['vip']; // Super Admin handles VIP

        if (role) {
            sql += ` AND role = $${params.length + 1}`;
            params.push(role);
        }
        if (country) {
            sql += ` AND country = $${params.length + 1}`;
            params.push(country);
        }

        sql += ' ORDER BY created_at DESC';
        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch applicants' });
    }
});

// Get Stats Grouped By Country and Role for the SVG Map Hover
app.get('/api/stats/countries', async (req, res) => {
    try {
        const sql = `
            SELECT country, role, COUNT(*) as count 
            FROM applicants 
            GROUP BY country, role 
            ORDER BY country, role;
        `;
        const result = await query(sql);

        // Format the data into a nested object: { "Ethiopia": { "Influencer": 10, "Media": 5...} }
        const formattedData = {};
        result.rows.forEach(row => {
            if (!formattedData[row.country]) {
                formattedData[row.country] = { total: 0 };
            }
            formattedData[row.country][row.role] = parseInt(row.count);
            formattedData[row.country].total += parseInt(row.count);
        });

        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch country statistics' });
    }
});

// Approve Applicant & Generate QR
app.post('/api/admin/approve/:id', async (req, res) => {
    const { id } = req.params;
    const { remark } = req.body;
    try {
        // Generate QR Code data (linking to the ID)
        const qrData = JSON.stringify({ id, action: 'accredit' });
        const qrImage = await QRCode.toDataURL(qrData);

        const result = await query(
            'UPDATE applicants SET status = $1, remark = $2, qr_code = $3 WHERE id = $4 RETURNING *',
            ['approved', remark, qrImage, id]
        );

        // Mock Notification
        console.log(`Notification: Applicant ${result.rows[0].email} approved.`);

        await query('INSERT INTO audit_logs (admin_id, action, target_id) VALUES ($1, $2, $3)',
            ['admin_user', 'APPROVED_APPLICANT', id]);

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Approval failed' });
    }
});

// QR Scan Verification
app.get('/api/admin/verify-qr/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM applicants WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Invalid QR Code' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Verification failed' });
    }
});

app.listen(PORT, () => {
    console.log(`ASMIS Server running on port ${PORT}`);
});
