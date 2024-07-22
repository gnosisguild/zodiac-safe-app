import dotenv from "dotenv"
dotenv.config()
import express, { Application, Request, Response } from "express"
import cors from "cors"
import { notFound, errorHandler } from "./middleware/ErrorMiddleware"
import SnapshotRoutes from "./routes/SnapshotRoute"
import MonitoringRoutes from "./routes/MonitoringRoute"

const port = process.env.PORT || 5000
console.log("port", process.env.PINATA_BASE_URL)
const app: Application = express()

app.use(express.json())

// Enable CORS for all routes
app.use(
  cors({
    origin: "*",
  }),
)

// Default
app.get("/api", (req: Request, res: Response) => {
  res.status(201).json({ message: "Zodiac server" })
})

// User Route
app.use("/api/ipfs-pinning", SnapshotRoutes)
app.use("/api/monitoring", MonitoringRoutes)

// Middleware
app.use(notFound)
app.use(errorHandler)

app.listen(port, (): void => console.log(`Server is running on ${port}`))
