import jwt from "jsonwebtoken"
const authUser = (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) return res.status(401)
    const payload = jwt.verify(token, process.env.SECRET_KEY)
    req.user = { _id: payload._id, role: payload.role }
    next()
  } catch (error) {
    return res.status(500).json(error)
  }
}

export default authUser
