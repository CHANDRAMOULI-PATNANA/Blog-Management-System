const express = require('express')
const { addComment, deleteComment } = require('../controllers/commentController')
const authenticate = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', authenticate, addComment)
router.delete('/:id', authenticate, deleteComment)

module.exports = router