import express from 'express'
import { addNewComment, addReply, addSuggestions, getSuggestion, getSuggestions, likeSuggestion } from '../controllers/suggestion.controller.js'
import { hasCookie } from '../middlewares/hasCookie.js'

const router = express.Router()

router.get("/getAll", hasCookie, getSuggestions)
router.get("/like/:suggestionId", hasCookie, likeSuggestion)
router.post("/addComment/:suggestionId", hasCookie, addNewComment)
router.post("/addReply/:suggestionId", hasCookie, addReply)
router.get("/:suggestionId", hasCookie, getSuggestion)
// router.get("/save", addSuggestions)

export default router