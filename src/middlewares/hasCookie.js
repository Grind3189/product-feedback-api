import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { generateId } from "../utils/generateId.js"

export const hasCookie = async (req, res, next) => {
  let token = req.cookies.accessToken

  if (!token) {
    const newUser = new User({
      image: "",
      name: "guest",
      username: "guest-" + generateId(),
      likes: []
    })
    const savedUser = await newUser.save()
    const payload = { userId: savedUser._id }
    const token = jwt.sign(payload, process.env.JWT_KEY)
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      origin: "https://product-feedback-bygrind.netlify.app"
    })
    req.userId = savedUser._id
    return next()
  }

  const decodedToken = jwt.verify(token, process.env.JWT_KEY)
  req.userId = decodedToken.userId

  next()
}
