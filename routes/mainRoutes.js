import express from "express"
const router = express.Router()
import userRoutes from "./userRoutes.js"
import uploadRoutes from "./uploadRoutes.js"
import postRoutes from "./postRoutes.js"
router.get("/", (req, res) => {
  res.status(200).send("server is running")
})

router.use("/user", userRoutes)
router.use("/upload", uploadRoutes)
router.use("/post", postRoutes)

export default router
