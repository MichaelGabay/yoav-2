import jwt from "jsonwebtoken"
const authUser = (req, res, next) => {
  try {
    const token = req.headers.authorization

    if (!token) return res.status(401).send("send token please")
    const payload = jwt.verify(token, process.env.SECRET_KEY)
    req.user = { _id: payload._id, role: payload.role }
    next()
  } catch (error) {
    return res.status(500).json(error)
  }
}
const authAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(401).json({ message: "Unauthorized" })
  next()
}
export default authUser
