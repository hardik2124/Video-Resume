import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  subscriptionPlan: {
    type: String,
    default: 'free'
  },
  googleId: {
    type: String
  }, 
  facebookId: {
    type: String
  },
}, { timestamps: true });



const User = mongoose.model('User', userSchema);
export default User;