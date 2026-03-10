import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Influencer', 'Media', 'Sponsor'],
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  // Add any other fields you need for the applicant
});

const User = mongoose.model('User', applicantSchema);

export default User;