import { User } from '../models/user.model.js'
import { sendToken } from '../utils/sendToken.js'
import { errorHandler } from '../utils/errorHandler.js'
import {
  validateUserSignUp,
  validateUserLogin,
} from '../validator/user.validator.js'

export const UserController = {
  createUser: async (req, res) => {
    try {
      // Check if there error in the req.body
      const { err } = validateUserSignUp(req.body)
      if (err) return errorHandler(res, 400, err)

      // Check if the user already exists

      const userExist = await User.findOne({ email: req.body.email })
      if (userExist)
        return errorHandler(res, { message: 'User already exists' }, 400)

      // Create a user
      const user = await User.create(req.body)

      if (!user)
        return errorHandler(res, { message: 'Error creating user' }, 400)

      sendToken(user, 200, res)
    } catch (error) {
      console.log(error.stack)
      return errorHandler(res, { message: 'Error occured' }, 400)
    }
  },
  loginUser: async (req, res) => {
    const { err } = validateUserLogin(req.body)
    if (err) return errorHandler(res, 400, err)

    try {
      const { email } = req.body
      const user = await User.findOne({ email }).select('+password')
      if (!user) return errorHandler(res, 400, err)
      // Compare password
      const isPasswordMatch = user.comparePassword(req.body.password)
      if (!isPasswordMatch)
        return errorHandler(res, { message: 'Password does not match' }, 401)
      sendToken(user, 200, res)
    } catch (error) {
      console.log(error.message)
    }
  },
}
