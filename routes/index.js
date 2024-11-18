import express from 'express'

import userRoutes from './users.route.js'
import blogRoutes from './blogs.route.js'

const router = express.Router()

router.use('/api/v1', userRoutes)
router.use('/api/v1', blogRoutes)

export default router
