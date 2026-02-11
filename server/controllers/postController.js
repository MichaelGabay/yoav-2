import postModel from "../models/postModel.js"
const postCtrl = {
    async createPost(req, res) {
        try {
            const newPost = { ...req.body, createdBy: req.user._id }
            const post = await postModel.create(newPost)
            res.status(201).json(post)
        } catch (error) {
            res.status(400).message("there was an error creating the post")
        }
    },
    // ?id=
    async getPost(req, res) {
        try {
            const post = await postModel.findOne({ _id: req.query.id })
            if (!post) return res.status(404).json({ message: "post not found" })
            res.status(200).json(post)
        } catch (error) {
            res.status(400).json({ message: "there was an error getting the post", error })
        }

    },
    // ?id=
    // note: only the owner of the post can update it
    async updatePost(req, res) {
        try {
            const post = await postModel.findById(req.query.id)
            if (!post) return res.status(404).json({ message: "post not found" })
            if (post.createdBy != req.user._id) return res.status(401).json({ message: "you are not the owner of the post" })
            const resp = await postModel.updateOne({ _id: req.query.id }, req.body)
            return res.status(200).json({ message: "post updated successfully", resp })
        } catch (error) {
            res.status(400).json({ message: "there was an error updating the post", error })
        }
    },
    // ?id=
    // note: only the owner of the post can delete it
    async deletePost(req, res) {
        try {
            const postId = req.query.id;
            const post = await postModel.findById(postId)
            if (!post) return res.status(404).json({ message: "post not found" })
            if (post.createdBy != req.user._id) return res.status(401).json({ message: "you are not the owner of the post" })
            const resp = await postModel.findByIdAndDelete(postId)
            res.status(200).json({ message: "post deleted successfully", resp })
        } catch (error) {
            res.status(400).json({ message: "there was an error deleting the post", error })
        }
    },
    // ?id=
    async likePost(req, res) {
        try {
            const post = await postModel.findById(req.query.id)
            if (!post) return res.status(404).json({ message: "post not found" })
            if (post.likes.includes(req.user._id)) return res.status(400).json({ message: "you already liked the post" })
            post.likes.push(req.user._id)
            const resp = await post.save()
            res.status(200).json({ message: "post liked successfully", resp })
        } catch (error) {
            res.status(400).json({ message: "there was an error liking the post", error })
        }
    },
    // ?id=
    async unlikePost(req, res) {
        try {
            const post = await postModel.findById(req.query.id)
            if (!post) return res.status(404).json({ message: "post not found" })
            if (!post.likes.includes(req.user._id)) return res.status(400).json({ message: "you can't unlike this post" })
            post.likes = post.likes.filter((id) => id != req.user._id)
            const resp = await post.save()
            res.status(200).json({ message: "post unliked successfully", resp })
        } catch (error) {
            res.status(400).json({ message: "there was an error liking the post", error })
        }
    },
    // ->[]
    async getPosts(req, res) {
        try {
            const posts = await postModel.aggregate([{ $sample: { size: 10 } }])
            res.status(200).json(posts)
        } catch (error) {
            res.status(400).json({ message: "there was an error getting posts", error })
        }
    },
    // ->[]
    async getPostsByUser(req, res) {
        try {
            const page = +req.query.page || 1
            const limit = 5
            const posts = await postModel.find().limit(limit).skip((page - 1) * limit);
            const pages = Math.ceil(await postModel.countDocuments() / limit)
            const resp = {
                pages,
                next: "http://localhost:3000/api/post/getUserPosts?page=" + (page + 1),
                data: posts
            }
            if (page == pages) delete resp.next
            res.status(200).json(resp)
        } catch (error) {
            res.status(400).json({ message: "there was an error getting posts", error })
        }
    }
}

export default postCtrl