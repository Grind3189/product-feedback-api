import express from 'express'
import { addSuggestions, getSuggestion, getSuggestions } from '../controllers/suggestions.controller.js'

const router = express.Router()

router.post("/suggestions", getSuggestions)
router.get("/suggestions/save", addSuggestions)
router.get("/suggestion/:suggestionId", getSuggestion)

export default router