import express from 'express'
import { addNewComment, addSuggestions, getSuggestion, getSuggestions, likeSuggestion } from '../controllers/suggestions.controller.js'

const router = express.Router()

router.post("/suggestions", getSuggestions)
router.post("/suggestion/like/:suggestionId", likeSuggestion)
router.post("/suggestion/:suggestionId", getSuggestion)
router.post("/suggestion/addComment/:suggestionId", addNewComment)
router.get("/suggestions/save", addSuggestions)

export default router