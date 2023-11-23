import { query } from "express"
import Suggestion from "../models/suggestion.model.js"
import User from "../models/user.model.js"
import { createError } from "../utils/createError.js"
import mongoose from "mongoose"

export const addNewComment = async (req, res, next) => {
  const { suggestionId } = req.params

  try {
    const suggestion = await Suggestion.findById(suggestionId)
    const user = await User.findById(req.userId)

    suggestion.comments.push({
      user: { ...user._doc, userId: req.userId },
      replies: [],
      content: req.body.newComment,
      _id: new mongoose.Types.ObjectId()
    })
    const updatedSuggestion = await suggestion.save()
    res.status(201).json(updatedSuggestion)
  } catch (err) {
    next(err)
  }
}

export const addReply = async (req, res, next) => {
  const { suggestionId } = req.params
  const { commentId, replyingTo, reply } = req.body

  try {
    const suggestion = await Suggestion.findById(suggestionId)
    const user = await User.findById(req.userId)
    const updatedComments = suggestion.comments.map((comment, i) => {
      if (comment._id.toString() === commentId) {
        return {
          ...comment._doc,
          replies: [
            ...comment.replies,
            {
              content: reply,
              replyingTo,
              user: {
                image: user.image,
                name: user.name,
                username: user.username,
                userId: user._id
              },
              _id: new mongoose.Types.ObjectId()
            }
          ]
        }
      } else return comment
    })

    suggestion.comments = updatedComments
    const updatedSuggestion = await suggestion.save()
    res.status(201).json(updatedSuggestion)
  } catch (err) {
    next(err)
  }
}

export const deleteComment = async (req, res, next) => {
  const { commentId } = req.query
  const { suggestionId } = req.params
  let updatedComments
  let error = false

  try {
    const suggestion = await Suggestion.findById(suggestionId)

    if (!suggestion) {
      return next(createError(404, "Suggestion does'nt exists"))
    }

    const comments = suggestion.comments

    comments.forEach((comment) => {
      if (comment._id.toString() === commentId) {
        if (comment.user.userId?.toString() === req.userId) {
          //Delete if the userId and userId from cookies matched
          updatedComments = comments.filter(
            (comment) => comment._id.toString() !== commentId
          )
          suggestion.comments = updatedComments
        } else {
          error = true
          return next(createError(403, "You can only delete your own comment"))
        }
      }
    })

    if (!error) {
      const updatedSuggestion = await suggestion.save()
      res.status(200).json(updatedSuggestion)
    }
  } catch (err) {
    next(err)
  }
}

export const deleteReply = async (req, res, next) => {
  const { suggestionId } = req.params
  const { commentId, replyId } = req.query
  let updatedComments
  let error = false

  const suggestion = await Suggestion.findById(suggestionId)

  if (!suggestion) {
    return next(createError(404, "Suggestion not found"))
  }

  const comments = suggestion.comments

  comments.forEach((comment) => {
    if (comment._id.toString() === commentId) {
      comment.replies.forEach((reply) => {
        if (reply._id.toString() === replyId) {
          if (reply.user.userId.toString() === req.userId) {
            updatedComments = comments.map((comment) => {
              if (comment._id.toString() === commentId) {
                return {
                  ...comment._doc,
                  replies: comment.replies.filter(
                    (reply) => reply._id.toString() !== replyId
                  )
                }
              } else return comment
            })
          } else {
            error = true
            return next(createError(403, "You can only delete your own reply"))
          }
        }
      })
    }
  })

  if(!error) {
    suggestion.comments = updatedComments
    const updatedSuggestion = await suggestion.save()
    res.status(200).json(updatedSuggestion)
  }

}
