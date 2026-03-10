import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const secretKey = process.env.JWT_SECRET;

export const login = async (req, res) => {
  const { username, password } = req.body;

  // Simulated user database
  const user = { id: 1, username, password: await bcrypt.hash(password, 10) };

  if (user.username === process.env.ADMIN_EMAIL && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, role: 'admin' }, secretKey);
    res.json({ message: 'Logged in', token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
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