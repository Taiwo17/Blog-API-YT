import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const { model, Schema } = mongoose

const userSchema = new Schema({
  fullName: {
    type: 'String',
    required: true,
    minLength: [3, 'Please write minimum of 3 characters'],
  },
  email: {
    type: 'String',
    required: true,
  },
  password: {
    type: 'String',
    required: true,
    select: false,
  },
  role: {
    type: 'String',
    enum: {
      values: ['user', 'moderator', 'admin'],
    },
    default: 'user',
  },
})

// Hasing the password

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  const saltRound = await bcrypt.genSalt(10)
  this.password = bcrypt.hash(this.password, saltRound)
  next()
})

// Generating the token for user
userSchema.methods.generateToken = function generateToken() {
  const options = {
    expiresIn: '6h',
    issuer: 'lms-hasher',
  }

  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    options
  )
}

// Comparing the user password

userSchema.methods.comparePassword = function (enterPassword) {
  return bcrypt.compare(enterPassword, this.password)
}

export const User = model('User', userSchema)
