import express from "express"
const router = express.Router()
import userRoutes from "./userRoutes.js"
import uploadRoutes from "./uploadRoutes.js"
router.get("/", (req, res) => {
  res.status(200).send("server is running")
})

router.use("/user", userRoutes)
router.use("/upload", uploadRoutes)

export default router
