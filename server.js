import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from 'cors'
import suggestionRoutes from "./src/routes/suggestion.route.js"
import roadmapRoutes from "./src/routes/roadmap.route.js"
import cookieParser from 'cookie-parser'

const app = express()
const corsOptions = {
  credentials: true,
  origin: 'http://localhost:5173',
  methods: 'GET, POST, DELETE, PUT',  
}

dotenv.config()
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())

app.use("/api/suggestion", suggestionRoutes)
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
