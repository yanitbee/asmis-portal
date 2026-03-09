import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// No DB initialization for demo

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access token required' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Middleware to check if user is admin or super_admin
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Middleware to check if user is super_admin
const requireSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Super admin access required' });
    }
    next();
};

// --- Public Routes ---

// Register Applicant
app.post('/api/register', async (req, res) => {
    const { role, full_name, email, country, organization, social_handle } = req.body;
    // For demo, just log and return success without saving
    console.log('Registration:', { role, full_name, email, country, organization, social_handle });
    res.status(201).json({ id: 'demo-id', role, full_name, email, country, organization, social_handle });
});

// Login for Admin/Super Admin
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    // Hardcoded users for demo
    const users = {
        admin: { password: 'admin123', role: 'admin' },
        superadmin: { password: 'super123', role: 'super_admin' }
    };
    const user = users[username];
    if (!user || password !== user.password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: username, username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
});

// --- Admin Routes ---

// Get All Applicants
app.get('/api/admin/applicants', authenticateToken, requireAdmin, async (req, res) => {
    // Mock data for demo
    const mockApplicants = [
        { id: '1', role: 'Influencer', full_name: 'John Doe', email: 'john@example.com', country: 'Ethiopia', status: 'pending', created_at: new Date() },
        { id: '2', role: 'Media', full_name: 'Jane Smith', email: 'jane@example.com', country: 'Kenya', status: 'approved', qr_code: 'data:image/png;base64,...', created_at: new Date() },
        { id: '3', role: 'Sponsor', full_name: 'Bob Johnson', email: 'bob@example.com', country: 'Nigeria', status: 'pending', created_at: new Date() },
        { id: '4', role: 'VIP', full_name: 'VIP User', email: 'vip@example.com', country: 'Ethiopia', status: 'vip', created_at: new Date() },
        { id: '5', role: 'Speaker', full_name: 'Alice Brown', email: 'alice@example.com', country: 'Ghana', status: 'rejected', created_at: new Date() }
    ];
    // Filter based on role
    let data = mockApplicants;
    if (req.user.role !== 'super_admin') {
        data = data.filter(app => app.status !== 'vip');
    }
    const { role, country } = req.query;
    if (role) data = data.filter(app => app.role === role);
    if (country) data = data.filter(app => app.country === country);
    res.json(data);
});

// Get Stats Grouped By Country and Role for the SVG Map Hover
app.get('/api/stats/countries', async (req, res) => {
    // Mock stats
    const mockStats = {
        'Ethiopia': { 'Influencer': 10, 'Media': 5, 'Sponsor': 2, total: 17 },
        'Kenya': { 'Influencer': 8, 'Media': 3, total: 11 },
        'Nigeria': { 'Media': 7, 'Sponsor': 4, total: 11 }
    };
    res.json(mockStats);
});

// Approve Applicant & Generate QR
app.post('/api/admin/approve/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { remark } = req.body;
    // Mock approval
    console.log(`Approved applicant ${id} by ${req.user.username}`);
    const mockApproved = { id, status: 'approved', remark, qr_code: 'data:image/png;base64,...' };
    res.json(mockApproved);
});

// Reject Applicant
app.post('/api/admin/reject/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { remark } = req.body;
    // Mock rejection
    console.log(`Rejected applicant ${id} by ${req.user.username}`);
    const mockRejected = { id, status: 'rejected', remark };
    res.json(mockRejected);
});

// QR Scan Verification
app.get('/api/admin/verify-qr/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    // Mock verification
    const mockApplicant = { id, full_name: 'Mock User', email: 'mock@example.com', status: 'approved' };
    res.json(mockApplicant);
});

app.listen(PORT, () => {
    console.log(`ASMIS Server running on port ${PORT}`);
});
