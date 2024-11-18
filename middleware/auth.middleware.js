import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import { errorHandler } from '../utils/errorHandler.js'

export const isAuthenticatedUser = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return errorHandler(
      res,
      { message: 'Not an authorized user, login first' },
      401
    )
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decoded.id)
  next()
}

export const authorizeRoles = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        errorHandler(
          res,
          {
            message: `You are not permitted to access this role ${req.role.user}`,
          },
          401
        )
      )
    }
    next()
  }
}
