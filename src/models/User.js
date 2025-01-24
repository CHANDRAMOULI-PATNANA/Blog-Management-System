const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Editor', 'User'], default: 'User' },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
})

const User = mongoose.model('User', userSchema)

module.exports = User