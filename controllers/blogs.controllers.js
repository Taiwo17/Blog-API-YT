import { Blog } from '../models/blog.model.js'
import { blogValidation } from '../validator/blog.validator.js'
import { errorHandler } from '../utils/errorHandler.js'

export const BlogController = {
  createBlog: async (req, res) => {
    try {
      const { err } = blogValidation(req.body)
      if (err) return errorHandler(res, 400, err)
      const blog = await Blog.create({
        title: req.body.title,
        content: req.body.content,
        image: req.file?.path || null,
        user: req.user._id,
      })
      return res.status(200).json({
        message: 'Blog created successfully',
        data: savedPost,
      })
    } catch (error) {
      console.log(error.stack)
      return errorHandler(res, { message: 'Error occured' }, 400)
    }
  },
  // Read all Blog
  getAllBlog: async (req, res) => {
    try {
      const blog = await Blog.find({}).populate('user')
      if (!blog) return errorHandler(res, { message: 'Error has occured' }, 400)
      return res.status(200).json({
        success: true,
        result: blog.length,
        data: blog,
      })
    } catch (error) {
      console.log(error.stack)
      return errorHandler(res, { message: 'Error occured' }, 400)
    }
  },
  // Get single blog
  getSingleBlog: async (req, res) => {
    try {
      const { id } = req.params
      const blog = await Blog.findOne({ _id: id })
      if (!blog) return errorHandler(res, { message: 'Error occured' }, 400)
      return res.status(200).json({
        message: 'success',
        data: blog,
      })
    } catch (error) {
      console.log(error.stack)
      return errorHandler(res, { message: 'Error occured' }, 400)
    }
  },

  // Update single blog

  updateSingleBlog: async (req, res) => {
    try {
      const { id } = req.params

      let blogs = await Blog.findOne({ _id: id })
      if (!blogs)
        return errorHandler(
          res,
          { message: `User ${id} isn't in database` },
          400
        )

      // Checking the owner of the data

      if (blogs.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return errorHandler(
          res,
          {
            message: `User(${req.user.role}) is not permitted to edit this blog posts`,
          },
          404
        )
      }
      // Updating the blog
      const options = {
        new: true,
        runValidator: true,
      }

      blogs = await Blog.findOneAndUpdate({ _id: id }, req.body, options)
      return res.status(200).json({
        success: true,
        message: 'Blog has been updated',
        data: blogs,
      })
    } catch (error) {
      console.log(error.stack)
      return errorHandler(res, { message: 'Error occured' }, 400)
    }
  },

  // Delete single blog

  deleteBlog: async (req, res) => {
    try {
      const { id } = req.params
      let blogs = await Blog.findOne({ _id: id })

      if (
        blogs.user !== req.user.id &&
        (req.user.role !== 'moderator' || req.user.role !== 'admin')
      ) {
        return errorHandler(
          res,
          {
            message: `User(${req.user.role}) is not permitted to delete this blog posts`,
          },
          404
        )
      }
      blogs = await Blog.findOneAndDelete({ _id: id }, options)
      const options = {
        new: true,
        runValidators: true,
      }
      blogs = await Blog.findOneAndDelete({ _id: id }, options) // Matching the req.params id to
      return res.status(200).json({
        success: true,
        message: 'Post has been deleted',
      })
    } catch (error) {
      console.log(error.stack)
      return errorHandler(res, { message: 'Error occured' }, 400)
    }
  },
}
