export const sendToken = (user, statusCode, res) => {
  const token = user.generateToken()
  return res.status(statusCode).cookie('token', token).json({
    succes: true,
    token,
  })
}
