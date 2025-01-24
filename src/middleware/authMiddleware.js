const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const User = require('../models/User')
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' })
  }
}