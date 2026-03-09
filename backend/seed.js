import { Pool } from 'pg';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

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
