import express from 'express'
import { getRoadmaps } from '../controllers/roadmap.controller.js'

const router = express.Router()

router.get("/getAll", getRoadmaps)

export default router