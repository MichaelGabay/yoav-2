import express from "express"
import postCtrl from "../controllers/postController.js"
import authUser from "../middlewares/auth.js"
import { uploadSingle } from "../middlewares/upload.js"
const router = express.Router()


router.post("/", authUser, postCtrl.createPost)
router.delete("/", authUser, postCtrl.deletePost)
router.get("/getSingle", postCtrl.getPost)
router.get("/getMany", postCtrl.getPosts)
router.get("/getUserPosts", authUser, postCtrl.getPostsByUser)
router.post("/like", authUser, postCtrl.likePost)
router.post("/unlike", authUser, postCtrl.unlikePost)
router.put("/update", authUser, postCtrl.updatePost)



export default router