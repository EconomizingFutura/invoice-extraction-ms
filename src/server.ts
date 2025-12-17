dotenv.config()

import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import invoiceRoutes from "./routes/invoice.routes"


const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/invoice", invoiceRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
})