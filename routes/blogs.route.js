import express from 'express'
import { BlogController } from '../controllers/blogs.controllers.js'
import upload from '../middleware/upload.js'
import {
  authorizeRoles,
  isAuthenticatedUser,
} from '../middleware/auth.middleware.js'

const router = express.Router()

router.post(
  '/create-blog',
  upload.single('image'),
  isAuthenticatedUser,
  BlogController.createBlog
)
router.get('/get-blogs', BlogController.getAllBlog)
router.get('/get-single-blog/:id', BlogController.getSingleBlog)
router.put(
  '/edit/:id',
  isAuthenticatedUser,
  authorizeRoles('admin', 'moderator'),
  BlogController.updateSingleBlog
)

router.delete(
  '/delete/:id',
  isAuthenticatedUser,
  authorizeRoles('admin', 'moderator'),
  BlogController.deleteBlog
)

export default router
