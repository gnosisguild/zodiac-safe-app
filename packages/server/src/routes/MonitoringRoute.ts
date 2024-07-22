import express from "express"
import { setUpMonitoring, monitoringValidation } from "../controller/MonitoringController"

const router = express.Router()

router.post("/notification", setUpMonitoring)
router.get("/validation", monitoringValidation)

export default router
