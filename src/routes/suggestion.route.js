import express from "express"
import {
  addNewSuggestion,
  addSuggestions,
  deleteSuggestion,
  editSuggestion,
  getSuggestion,
  getSuggestions,
  likeSuggestion
} from "../controllers/suggestion.controller.js"
import { hasCookie } from "../middlewares/hasCookie.js"

const router = express.Router()

router.get("/getAll", hasCookie, getSuggestions)
router.get("/like/:suggestionId", hasCookie, likeSuggestion)
router.post("/addSuggestion", hasCookie, addNewSuggestion)
router.post("/edit/:suggestionId", hasCookie, editSuggestion)
router.delete("/delete/:suggestionId", hasCookie, deleteSuggestion)
router.get("/:suggestionId", hasCookie, getSuggestion)
// router.get("/save", addSuggestions)

export default router
