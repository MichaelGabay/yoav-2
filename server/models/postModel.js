import mongoose from "mongoose"
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    // id of each user who likes the post
    likes: [String],
    comments: [{ name: String, comment: String, image: String }],
    createdBy: mongoose.Schema.Types.ObjectId
}, { timestamps: true })

export default mongoose.model("Post", postSchema)
