import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from 'cors'
import suggestionRoutes from "./src/routes/suggestions.route.js"

const app = express()

dotenv.config()
app.use(cors())
app.use(express.json())

app.use("/api", suggestionRoutes)

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
