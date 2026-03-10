import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const secretKey = process.env.JWT_SECRET;

export const login = async (req, res) => {
  const { username, password } = req.body;

  // Hardcoded users for demo
  const users = {
      admin: { password: '1234', role: 'admin' },
      superadmin: { password: '12345', role: 'super_admin' }
  };
  
  const user = users[username];
  if (!user || password !== user.password) {
      return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign({ id: username, username, role: user.role }, secretKey || 'your-secret-key', { expiresIn: '1h' });
  res.json({ message: 'Logged in', token, role: user.role });
};
export const registerApplicant = async (req, res) => {
  const { username, password, role, country } = req.body;

  // Check if applicant already exists
  const existingApplicant = await User.findOne({ username });
  if (existingApplicant) {
    return res.status(400).json({ error: 'Applicant already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new applicant
  const newApplicant = new User({ username, password: hashedPassword, role, country });
  await newApplicant.save();

  // Generate JWT token
  const token = jwt.sign({ id: newApplicant._id, role: newApplicant.role }, secretKey);

  // Return token and applicant details
  res.json({ message: 'Applicant registered successfully', token, applicant: newApplicant });
};