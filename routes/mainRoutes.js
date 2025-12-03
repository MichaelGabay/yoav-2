import express from "express"
const router = express.Router()
import userRoutes from "./userRoutes.js"

router.get("/", (req, res) => {
  res.status(200).send("server is running")
})

router.use("/user", userRoutes)

export default router
