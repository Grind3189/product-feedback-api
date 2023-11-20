import mongoose from "mongoose"

const Schema = mongoose.Schema

const userSchema = new Schema({
  image: String,
  name: String,
  username: String,
  likes: [String]
})

const User = mongoose.model("User", userSchema)

export default User
