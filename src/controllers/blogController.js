const Blog = require('../models/Blog')
const User = require('../models/User')

exports.createBlog = async (req, res) => {
  const { title, content } = req.body
  const author = req.user._id

  try {
    const blog = new Blog({ title, content, author })
    await blog.save()
    res.status(201).json({ message: 'Blog created successfully', blog })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username').populate('assignedEditor', 'username').populate('comments')
    res.json({ blogs })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getBlogById = async (req, res) => {
  const { id } = req.params

  try {
    const blog = await Blog.findById(id).populate('author', 'username').populate('assignedEditor', 'username').populate('comments')
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    res.json({ blog })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.updateBlog = async (req, res) => {
  const { id } = req.params
  const { title, content, assignedEditor } = req.body

  try {
    const blog = await Blog.findById(id)

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    if (req.user.role !== 'Admin' && blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' })
    }

    if (assignedEditor) {
      const editor = await User.findById(assignedEditor)
      if (!editor || editor.role !== 'Editor') {
        return res.status(400).json({ message: 'Invalid editor' })
      }
      blog.assignedEditor = assignedEditor
    }

    blog.title = title || blog.title
    blog.content = content || blog.content
    await blog.save()

    res.json({ message: 'Blog updated successfully', blog })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.deleteBlog = async (req, res) => {
  const { id } = req.params

  try {
    const blog = await Blog.findById(id)

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    if (req.user.role !== 'Admin' && blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' })
    }

    await blog.remove()
    res.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}