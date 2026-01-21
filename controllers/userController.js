import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userCtrl = {
  async singup(req, res) {
    try {
      // על מנת להצפין את הסיסמה
      req.body.password = await bcrypt.hash(req.body.password, 10)
      const user = await userModel.create(req.body)
      user.password = "***********"
      res.status(201).json({ message: "User created successfully", user })
    } catch (err) {
      res
        .status(err.code == 11000 ? 409 : 500)
        .json({ message: "Internal server error", err })
    }
  },

  async login(req, res) {
    try {
      const user = await userModel.findOne({ email: req.body.email })
      if (!user) return res.status(401).send("invalid credentails")
      let isOk = await bcrypt.compare(req.body.password, user.password)
      if (!isOk) return res.status(401).send("invalid credentails")
      const token = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "30d" }
      )
      res.status(200).json({ message: "login successful", token })
    } catch (error) {
      res.status(401).json(error)
    }
  },

  async getInfo(req, res) {
    try {
      const user = await userModel.findOne(
        { _id: req.user._id },
        { password: 0 }
      )
      return res.status(200).json(user)
    } catch (error) {
      return res.status(500).json(error)
    }
  },
}

export default userCtrl
