import { Pool } from 'pg';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const countries = [
    'Ethiopia', 'Kenya', 'Nigeria', 'South Africa', 'Egypt',
    'Ghana', 'Tanzania', 'Uganda', 'Rwanda', 'Senegal'
];
const roles = ['Influencer', 'Media', 'Sponsor', 'Public'];

async function seed() {
    console.log('Starting seeder...');
    try {
        await pool.query('DELETE FROM applicants'); // Clear existing dummy data (optional but good for clean slates)
        console.log('Existing applicants cleared.');

        // Seed admin users
        const adminPassword = await bcrypt.hash('admin123', 10);
        const superAdminPassword = await bcrypt.hash('super123', 10);

        await pool.query('DELETE FROM users'); // Clear existing users
        await pool.query(
            'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
            ['admin', adminPassword, 'admin']
        );
        await pool.query(
            'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
            ['superadmin', superAdminPassword, 'super_admin']
        );
        console.log('Admin users seeded.');

        for (let i = 0; i < 150; i++) {
            const country = countries[Math.floor(Math.random() * countries.length)];
            const role = roles[Math.floor(Math.random() * roles.length)];

            await pool.query(
                'INSERT INTO applicants (role, full_name, email, country, organization, status) VALUES ($1, $2, $3, $4, $5, $6)',
                [
                    role,
                    `Mock User ${i}`,
                    `mock${i}@example.com`,
                    country,
                    'Mock Org',
                    'approved' // Automatically approve them so they show in normal metrics if needed
                ]
            );
        }
        console.log('Seeding complete! Inserted 150 mock applicants.');
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        pool.end();
    }
}

seed();
