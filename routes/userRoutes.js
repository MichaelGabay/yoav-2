import express from "express"
import userCtrl from "../controllers/userController.js"
import authUser from "../middlewares/auth.js"
const router = express.Router()

router.post("/signup", userCtrl.singup)

router.post("/login", userCtrl.login)

router.get("/", authUser, userCtrl.getInfo)

export default router
