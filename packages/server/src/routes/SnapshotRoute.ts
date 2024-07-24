import express from "express"
import { setSnapshotSettings } from "../controller/SnapshotController"

const router = express.Router()

router.post("/snapshot-settings", setSnapshotSettings)

export default router
