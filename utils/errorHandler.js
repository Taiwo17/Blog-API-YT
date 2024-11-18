export const errorHandler = (res, statusCode, err) => {
  return res.status(statusCode).json({
    message: err.message,
  })
}
