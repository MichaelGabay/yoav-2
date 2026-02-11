import express from "express"
import userCtrl from "../controllers/userController.js"
import authUser from "../middlewares/auth.js"
import { loginValidation, signUpValidation } from "../validation/userValidation.js"
const router = express.Router()

router.post("/signup", signUpValidation, userCtrl.singup)

router.post("/login", loginValidation, userCtrl.login)

router.get("/", authUser, userCtrl.getInfo)

export default router
