import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE)
    console.log('Database connected')
  } catch (error) {
    console.error('Database connection failed:', error.message)
    throw error
  }
}
