import express from "express"
import userCtrl from "../controllers/userController.js"
import authUser from "../middlewares/auth.js"
import uploadCtrl from "../controllers/uploadController.js"
import { uploadSingle } from "../middlewares/upload.js"
const router = express.Router()

router.post("/single", authUser, uploadSingle, uploadCtrl.uploadSingle)


export default router
