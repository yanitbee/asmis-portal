
import { query } from './db.js';

async function checkUsers() {
    try {
        const result = await query('SELECT username, role FROM users');
        console.log('Database users:', result.rows);
    } catch (err) {
        console.error('Error checking users:', err);
    }
}

checkUsers();
