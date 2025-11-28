const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true },
  phone: { type: String },
  password: { type: String, required: true },
  name: { type: String },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  kyc: {
    status: { type: String, enum:['pending','approved','rejected'], default: 'pending' },
    docs: [{ filename: String, path: String, uploadedAt: Date }],
    reviewedAt: Date,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function(candidate) { 
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
