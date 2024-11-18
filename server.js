import express from 'express'
import dotenv from 'dotenv'

import { connectDB } from './database/database.js'
import routes from './routes/index.js'

const server = express()
const port = 4000

// Express inbuilt method
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

// Environment variable
dotenv.config()

// Database configuration
connectDB()
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(err.message))

server.get('/', (req, res) => {
  res.status(200).json({
    message: 'This is the home route',
  })
})

server.use(routes)

// Handle Undefined Routes
server.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Error Handling Middleware
server.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || 'Internal Server Error' })
})

server.listen(port, () => console.log(`Server is listening on port ${port}`))
