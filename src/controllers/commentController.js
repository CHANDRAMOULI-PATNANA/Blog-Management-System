const Comment = require('../models/Comment')
const Blog = require('../models/Blog')

exports.addComment = async (req, res) => {
  const { content, blogId } = req.body
  const author = req.user._id

  try {
    const blog = await Blog.findById(blogId)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    const comment = new Comment({ content, author, blog: blogId })
    await comment.save()

    blog.comments.push(comment._id)
    await blog.save()

    res.status(201).json({ message: 'Comment added successfully', comment })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.deleteComment = async (req, res) => {
  const { id } = req.params

  try {
    const comment = await Comment.findById(id)

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' })
    }

    await comment.remove()

    const blog = await Blog.findById(comment.blog)
    if (blog) {
      blog.comments = blog.comments.filter((c) => c.toString() !== comment._id.toString())
      await blog.save()
    }

    res.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}