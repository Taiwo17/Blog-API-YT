import 'dotenv/config'
import express from 'express'

import { connectDB } from './database/database.js'
import routes from './routes/index.js'

const server = express()
const port = process.env.PORT || 5000

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.get('/', (req, res) => {
  res.status(200).json({
    message: 'This is the home route',
  })
})

server.use(routes)

server.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

const startServer = async () => {
  try {
    await connectDB()

    server.listen(port, '0.0.0.0', () => {
      console.log(`Server is listening on port ${port}`)
    })
  } catch (error) {
    console.error('Application failed to start:', error.message)
    process.exit(1)
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer()
}

export default server
