import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authController from './controllers/authController.js';
import adminController from './controllers/adminController.js';
import authMiddleware from './middleware/authMiddleware.js';
import roleMiddleware from './middleware/roleMiddleware.js';
import noCacheMiddleware from './middleware/noCacheMiddleware.js';

import { initDb } from './db.js';

dotenv.config();

console.log('Server process starting...');

// Initialize database tables
initDb();

const app = express();
app.use((req, res, next) => {
    console.log(`[EARLY DEBUG] ${req.method} ${req.url}`);
    next();
});
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// API routes
app.use('/api', noCacheMiddleware, authRoutes);
app.use('/api', noCacheMiddleware, adminRoutes);

// Test route
app.get('/test', (req, res) => {
    console.log('Test route hit');
    res.json({ message: 'Server is reachable' });
});

// Register applicant routes
app.post('/api/applicants', authMiddleware, authController.registerApplicant);

// Dashboard routes
app.get('/api/dashboard', authMiddleware, adminController.getDashboard);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});


// --- Public Routes ---

// Register Applicant
app.post('/api/register', async (req, res) => {
    const { role, full_name, email, country, organization, social_handle } = req.body;
    // For demo, just log and return success without saving
    console.log('Registration:', { role, full_name, email, country, organization, social_handle });
    res.status(201).json({ id: 'demo-id', role, full_name, email, country, organization, social_handle });
});


// --- Admin Routes ---

// Get All Applicants
app.get('/api/admin/applicants', authMiddleware, roleMiddleware.requireAdmin, async (req, res) => {
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
app.post('/api/admin/approve/:id', authMiddleware, roleMiddleware.requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { remark } = req.body;
    // Mock approval
    console.log(`Approved applicant ${id} by ${req.user.username}`);
    const mockApproved = { id, status: 'approved', remark, qr_code: 'data:image/png;base64,...' };
    res.json(mockApproved);
});

// Reject Applicant
app.post('/api/admin/reject/:id', authMiddleware, roleMiddleware.requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { remark } = req.body;
    // Mock rejection
    console.log(`Rejected applicant ${id} by ${req.user.username}`);
    const mockRejected = { id, status: 'rejected', remark };
    res.json(mockRejected);
});


// QR Scan Verification
app.get('/api/admin/verify-qr/:id', authMiddleware, roleMiddleware.requireAdmin, async (req, res) => {
    const { id } = req.params;
    // Mock verification
    const mockApplicant = { id, full_name: 'Mock User', email: 'mock@example.com', status: 'approved' };
    res.json(mockApplicant);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`ASMIS Server running on http://0.0.0.0:${PORT}`);
});
