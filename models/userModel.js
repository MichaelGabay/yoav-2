import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  phone: String,
  address: String,
  role: {
    type: String,
    default: "user",
  },
})

export default mongoose.model("User", userSchema)
