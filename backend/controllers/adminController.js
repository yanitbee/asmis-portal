import { Applicant } from '../models/Applicant.js';

export const getApplicants = async (req, res) => {
  // Simulated applicant data
  const applicants = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    // ...
  ];

  res.json({ applicants });
};

export const approveApplicant = async (req, res) => {
  const { id } = req.params;

  // Simulated applicant approval
  const applicant = await Applicant.findById(id);
  if (!applicant) {
    return res.status(404).json({ message: 'Applicant not found' });
  }

  applicant.status = 'approved';
  await applicant.save();

  res.json({ message: 'Applicant approved' });
};

export const rejectApplicant = async (req, res) => {
  const { id } = req.params;

  // Simulated applicant rejection
  const applicant = await Applicant.findById(id);
  if (!applicant) {
    return res.status(404).json({ message: 'Applicant not found' });
  }

  applicant.status = 'rejected';
  await applicant.save();

  res.json({ message: 'Applicant rejected' });
};

export const verifyQR = async (req, res) => {
  const { id } = req.params;

  // Simulated QR code verification
  res.json({ message: 'QR code verified' });
};

export const getDashboard = async (req, res) => {
  // Simulated dashboard data
  const dashboardData = {
    totalApplicants: await Applicant.countDocuments(),
    approvedApplicants: await Applicant.countDocuments({ status: 'approved' }),
    pendingApplicants: await Applicant.countDocuments({ status: 'pending' }),
    rejectedApplicants: await Applicant.countDocuments({ status: 'rejected' }),
    vipApplicants: await Applicant.countDocuments({ status: 'vip' }),
  };

  res.json({ dashboardData });
};