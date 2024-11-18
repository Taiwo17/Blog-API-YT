import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE)
  } catch (error) {
    console.log('Error in connection')
  }
}
