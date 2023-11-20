import express from 'express'
import { addNewComment, addReply, addSuggestions, getSuggestion, getSuggestions, likeSuggestion } from '../controllers/suggestions.controller.js'

const router = express.Router()

router.post("/suggestions", getSuggestions)
router.post("/suggestion/like/:suggestionId", likeSuggestion)
router.post("/suggestion/:suggestionId", getSuggestion)
router.post("/suggestion/addComment/:suggestionId", addNewComment)
router.post("/suggestion/addReply/:suggestionId", addReply)
router.get("/suggestions/save", addSuggestions)

export default router