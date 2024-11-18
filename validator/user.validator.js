import Joi from 'joi'

const userSignUp = Joi.object({
  fullName: Joi.string().min(3).required().messages({
    'string.empty': 'Full Name is required',
    'string.min': 'Please write a minimum of 3 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string()
    .min(6) // You can define your own password requirements
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
    }),
  role: Joi.string()
    .valid('user', 'moderator', 'admin')
    .default('user')
    .messages({
      'any.only': 'Role must be one of [user, moderator, admin]',
    }),
})

const userLogin = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
})

export const validateUserSignUp = (data) => {
  const { err, value } = userSignUp.validateAsync(data)
  return { err: err, value }
}

export const validateUserLogin = (data) => {
  const { err, value } = userLogin.validateAsync(data)
  return { err: err, value }
}
