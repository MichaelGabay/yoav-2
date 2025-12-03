import express from "express"
import userModel from "../models/userModel.js"
const router = express.Router()

router.post("/signup", async (req, res) => {
  console.log(req.body)

  try {
    const user = await userModel.create(req.body)
    res.status(200).json({ message: "User created successfully", user })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal server error" })
  }
})

// routes
export default router
