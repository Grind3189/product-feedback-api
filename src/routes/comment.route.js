import express from 'express'
import { hasCookie } from '../middlewares/hasCookie.js'
import { addNewComment, addReply, deleteComment, deleteReply } from '../controllers/comment.controller.js'

const router = express.Router()

router.post("/addComment/:suggestionId", hasCookie, addNewComment)
router.post("/addReply/:suggestionId", hasCookie, addReply)
router.delete("/deleteComment/:suggestionId", hasCookie, deleteComment)
router.delete("/deleteReply/:suggestionId", hasCookie, deleteReply)

export default router