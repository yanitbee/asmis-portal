import { query } from '../db.js';

export const getApplicants = async (req, res) => {
  try {
    const result = await query('SELECT * FROM applicants ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ error: 'Error fetching applicants' });
  }
};

export const approveApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    await query('UPDATE applicants SET status = $1 WHERE id = $2', ['approved', id]);
    res.json({ message: 'Applicant approved' });
  } catch (error) {
    console.error('Error approving applicant:', error);
    res.status(500).json({ error: 'Error approving applicant' });
  }
};

export const rejectApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    await query('UPDATE applicants SET status = $1 WHERE id = $2', ['rejected', id]);
    res.json({ message: 'Applicant rejected' });
  } catch (error) {
    console.error('Error rejecting applicant:', error);
    res.status(500).json({ error: 'Error rejecting applicant' });
  }
};

export const verifyQR = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM applicants WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Applicant not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error verifying QR:', error);
    res.status(500).json({ error: 'Error verifying QR' });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const totalResult = await query('SELECT COUNT(*) FROM applicants');
    const statusResults = await query('SELECT status, COUNT(*) FROM applicants GROUP BY status');
    
    const stats = {
      totalApplicants: parseInt(totalResult.rows[0].count),
      approvedApplicants: 0,
      pendingApplicants: 0,
      rejectedApplicants: 0,
      vipApplicants: 0
    };

    statusResults.rows.forEach(row => {
      if (row.status === 'approved') stats.approvedApplicants = parseInt(row.count);
      if (row.status === 'pending') stats.pendingApplicants = parseInt(row.count);
      if (row.status === 'rejected') stats.rejectedApplicants = parseInt(row.count);
      if (row.status === 'vip') stats.vipApplicants = parseInt(row.count);
    });

    res.json({ dashboardData: stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Error fetching dashboard stats' });
  }
};

export default { getApplicants, approveApplicant, rejectApplicant, verifyQR, getDashboard };