const express = require('express')
const { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/blogController')
const authenticate = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

const router = express.Router()

router.post('/', authenticate, authorizeRoles('Admin', 'Editor'), createBlog)
router.get('/', getBlogs)
router.get('/:id', getBlogById)
router.put('/:id', authenticate, authorizeRoles('Admin', 'Editor'), updateBlog)
router.delete('/:id', authenticate, authorizeRoles('Admin', 'Editor'), deleteBlog)

module.exports = router