import Suggestion from "../models/suggestion.model.js"
import User from "../models/user.model.js"
import data from "../data.json" assert { type: "json" }
import { nanoid } from "nanoid"
import { createError } from "../utils/createError.js"
import mongoose from "mongoose"

export const getSuggestions = async (req, res, next) => {
  const { sort } = req.query

  try {
    const suggestions = await Suggestion.find()
    if (sort === "Least Upvotes") {
      suggestions.sort((a, b) => a.upvotes - b.upvotes)
    } else if (sort === "Most Comments") {
      suggestions.sort((a, b) => b.comments.length - a.comments.length)
    } else if (sort === "Least Comments") {
      suggestions.sort((a, b) => a.comments.length - b.comments.length)
    } else {
      suggestions.sort((a, b) => b.upvotes - a.upvotes)
    }

    if (req.body.userId) {
      const existerUser = await User.findById(req.body.userId)
      if (existerUser) {
        return res.status(200).json({ currentUser: existerUser, suggestions })
      }
    }
    const newUser = new User({
      image: "",
      name: "guest",
      username: "guest-" + nanoid(5)
    })

    const savedUser = await newUser.save()
    return res.status(201).json({ currentUser: savedUser, suggestions })
  } catch (err) {
    next(err)
  }
}
export const getSuggestion = async (req, res, next) => {
  const params = req.params.suggestionId
  console.log(params)
  try {
    const suggestion = await Suggestion.findById(params)

    if (!suggestion) {
      return createError(404, "Suggestion does'nt exists")
    }

    res.status(200).json(suggestion)
  } catch (err) {
    next(err)
  }
}

export const addSuggestions = async (req, res, next) => {
  try {
    for (const suggestion of data.productRequests) {
      const { title, category, description, status, upvotes, comments } =
        suggestion
      const newSuggestion = new Suggestion({
        title,
        category,
        description,
        status,
        upvotes,
        comments: comments
          ? comments.map((comment) => {
              return {
                ...comment,
                _id: new mongoose.Types.ObjectId(),
                replies: comment.replies ? comment.replies : []
              }
            })
          : []
      })

      await newSuggestion.save()
    }
  } catch (err) {
    console.error(err)
  }
}
