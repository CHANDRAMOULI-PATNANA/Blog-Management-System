const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')

exports.signUp = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })

    const user = new User({ username, email, password: hashedPassword, verificationToken })
    await user.save()

    // Send verification email
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`
    await sendEmail(email, 'Verify Your Email', `Click here to verify your email: ${verificationLink}`)

    res.status(201).json({ message: 'User created successfully. Please verify your email.' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.verifyEmail = async (req, res) => {
  const { token } = req.query

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ email: decoded.email })

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' })
    }

    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    res.json({ message: 'Email verified successfully' })
  } catch (error) {
    res.status(400).json({ message: 'Invalid verification token' })
  }
}