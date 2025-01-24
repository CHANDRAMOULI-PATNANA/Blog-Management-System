const Blog = require('../models/blogModel');
const User = require('../models/userModel');

exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = new Blog({ title, content, author: req.userId });
    await blog.save();
    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username');
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username').populate('comments');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.author.toString() !== req.userId && req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    await blog.save();
    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.author.toString() !== req.userId && req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await blog.remove();
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.assignBlogToEditor = async (req, res) => {
  try {
    const { blogId, editorId } = req.body;
    const blog = await Blog.findById(blogId);
    const editor = await User.findById(editorId);
    if (!blog || !editor) {
      return res.status(404).json({ message: 'Blog or Editor not found' });
    }
    if (blog.editor) {
      return res.status(400).json({ message: 'Blog is already assigned to an editor' });
    }
    blog.editor = editorId;
    await blog.save();
    res.status(200).json({ message: 'Blog assigned to editor successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};