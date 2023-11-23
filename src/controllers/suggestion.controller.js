
import { createError } from "../utils/createError.js"
import jwt from "jsonwebtoken"
import Suggestion from "../models/suggestion.model.js"
import User from "../models/user.model.js"
import { generateId } from "../utils/generateId.js"

export const getSuggestions = async (req, res, next) => {
  const { sort, category } = req.query

  try {
    let suggestions
    if (category && category !== "All") {
      suggestions = await Suggestion.find({ category: category.toLowerCase() })
    } else {
      suggestions = await Suggestion.find()
    }

    if (sort === "Least Upvotes") {
      suggestions.sort((a, b) => a.upvotes - b.upvotes)
    } else if (sort === "Most Comments") {
      suggestions.sort((a, b) => b.comments.length - a.comments.length)
    } else if (sort === "Least Comments") {
      suggestions.sort((a, b) => a.comments.length - b.comments.length)
    } else {
      suggestions.sort((a, b) => b.upvotes - a.upvotes)
    }

    let modifiedSuggestions

    if (req.userId) {
      const existerUser = await User.findById(req.userId)
      if (existerUser) {
        modifiedSuggestions = suggestions.map((suggestion) => {
          return {
            ...suggestion._doc,
            isLiked: existerUser.likes.includes(suggestion._id)
          }
        })
        return res
          .status(200)
          .json({ currentUser: existerUser, suggestions: modifiedSuggestions })
      }
    }

    modifiedSuggestions = suggestions.map((suggestion) => {
      return {
        ...suggestion._doc,
        isLiked: false
      }
    })

    const newUser = new User({
      image: "",
      name: "guest",
      username: "guest-" + generateId(),
      likes: []
    })

    const savedUser = await newUser.save()
    const payload = { userId: savedUser._id }
    const token = jwt.sign(payload, process.env.JWT_KEY)
    return res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None"
      })
      .status(201)
      .json({ currentUser: savedUser, suggestions: modifiedSuggestions })
  } catch (err) {
    next(err)
  }
}

export const getSuggestion = async (req, res, next) => {
  const params = req.params.suggestionId
  try {
    const suggestion = await Suggestion.findById(params)
    if (!suggestion) {
      return next(createError(404, "Suggestion does'nt exists"))
    }
    const user = await User.findById(req.userId)
    res.status(200).json({
      ...suggestion._doc,
      isLiked: user?.likes?.includes(suggestion._id) || false
    })
  } catch (err) {
    next(err)
  }
}

export const likeSuggestion = async (req, res, next) => {
  const { suggestionId } = req.params
  let isAdded = false
  try {
    const user = await User.findById(req.userId)
    if (user.likes.includes(suggestionId)) {
      const updatedLikes = user.likes.filter((like) => like !== suggestionId)
      user.likes = updatedLikes
    } else {
      user.likes.push(suggestionId)
      isAdded = true
    }
    const savedUser = await user.save()
    const suggestion = await Suggestion.findByIdAndUpdate(
      suggestionId,
      { $inc: { upvotes: isAdded ? 1 : -1 } },
      { new: true }
    )
    const modifedSuggestion = {
      ...suggestion._doc,
      isLiked: savedUser.likes.includes(suggestion._id)
    }
    res.status(200).json(modifedSuggestion)
  } catch (err) {
    next(err)
  }
}

export const addNewSuggestion = async (req, res, next) => {
  const newFeedbackData = req.body.newFeedbackData

  const newSuggestion = new Suggestion({
    ...newFeedbackData,
    status: "suggestion",
    upvotes: 0,
    comments: [],
    userId: req.userId
  })

  await newSuggestion.save()
  res.status(201).send("New suggestion added")
}

export const editSuggestion = async (req, res, next) => {
  const { suggestionId } = req.params
  const { title, category, description } = req.body
  const suggestion = await Suggestion.findById(suggestionId)

  if (!suggestion) return next(createError(404, "Suggestion not found"))
  if (suggestion.userId?.toString() !== req.userId)
    return next(createError(403, "You can only edit your own suggestion"))

  suggestion.title = title
  suggestion.category = category
  suggestion.description = description

  const updatedSuggestion = await suggestion.save()

  res.status(201).json(updatedSuggestion)
}

export const deleteSuggestion = async (req, res, next) => {
  const { suggestionId } = req.params

  const suggestion = await Suggestion.findById(suggestionId)

  if (!suggestion) return next(createError(404, "Suggestion not found."))
  if (suggestion.userId.toString() !== req.userId)
    return next(createError(403, "You can only delete your own suggestion."))

   await Suggestion.findByIdAndDelete(suggestionId)
   
   res.status(200).send("Successfully deleted")
}
