
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function resetDb() {
    try {
        console.log('Dropping tables...');
        await pool.query('DROP TABLE IF EXISTS applicants, audit_logs, content, users CASCADE');
        console.log('Tables dropped.');
        
        console.log('Recreating tables...');
        const createTablesQuery = `
        CREATE TABLE IF NOT EXISTS applicants (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          role VARCHAR(50) NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          country VARCHAR(100) NOT NULL,
          organization VARCHAR(255),
          social_handle VARCHAR(255),
          status VARCHAR(20) DEFAULT 'pending',
          remark TEXT,
          qr_code TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
          id SERIAL PRIMARY KEY,
          admin_id VARCHAR(50) NOT NULL,
          action TEXT NOT NULL,
          target_id UUID,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS content (
          id SERIAL PRIMARY KEY,
          type VARCHAR(50),
          title VARCHAR(255),
          content TEXT,
          media_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(20) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
        await pool.query(createTablesQuery);
        console.log('Tables recreated.');
    } catch (err) {
        console.error('Reset failed:', err);
    } finally {
        pool.end();
    }
}

resetDb();
