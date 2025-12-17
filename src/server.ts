import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"

import invoiceRoutes from "./routes/invoice.routes"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/health", (_req, res) => {
  res.status(200).send("OK")
})

app.use("/api/invoice", invoiceRoutes)

const PORT = parseInt(process.env.PORT ?? "10000", 10)

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
