import Joi from 'joi'

const blogValidationSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Title is required',
    'string.base': 'Title must be a string',
  }),
  content: Joi.string().required().messages({
    'string.empty': 'Content is required',
    'string.base': 'Content must be a string',
  }),
  image: Joi.string()
    .uri() // Ensures it's a valid URL if provided
    .optional()
    .messages({
      'string.uri': 'Image must be a valid URL',
    }),
  user: Joi.string(),
})

export const blogValidation = (data) => {
  const { err, value } = blogValidationSchema.validateAsync(data)
  return { err: err, value }
}
