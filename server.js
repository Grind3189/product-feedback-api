import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from 'cors'
import suggestionRoutes from "./src/routes/suggestion.route.js"
import roadmapRoutes from "./src/routes/roadmap.route.js"
import commentRoutes from './src/routes/comment.route.js'
import cookieParser from 'cookie-parser'
import helmet from "helmet"

const app = express()
const corsOptions = {
  origin: '*',
  methods: 'GET, POST, DELETE, PUT',  
  credentials: true,
}

dotenv.config()
app.use(cors(corsOptions))
app.use(helmet())
app.use(cookieParser())
app.use(express.json())

app.use("/api/suggestion", suggestionRoutes)
app.use("/api/comment", commentRoutes)
app.use("/api/roadmap", roadmapRoutes)

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || "Something went wrong"
  return res.status(errorStatus).send(errorMessage)
})

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Listening to port:" + process.env.PORT)
    })
  })
  .catch((err) => console.error(err))
