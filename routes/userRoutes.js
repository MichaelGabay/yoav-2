import express from "express"
import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
const router = express.Router()

router.post("/signup", async (req, res) => {
  try {
    // על מנת להצפין את הסיסמה
    req.body.password = await bcrypt.hash(req.body.password, 10)
    const user = await userModel.create(req.body)
    user.password = "***********"
    res.status(201).json({ message: "User created successfully", user })
  } catch (err) {
    console.log(err)
    res
      .status(err.code == 11000 ? 409 : 500)
      .json({ message: "Internal server error", err })
  }
})

// routes
export default router
