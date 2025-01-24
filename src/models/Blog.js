const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedEditor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog