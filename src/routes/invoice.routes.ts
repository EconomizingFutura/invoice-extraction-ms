import { Router } from "express"
import multer from "multer"
import fs from "fs"
import { extractInvoice } from "../services/invoice.service.js"
import { extractPageText } from "../utils/text.util.js"

const router = Router()
const upload = multer({ dest: "uploads/" })

router.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "File missing" })

    const temp = req.file.path
    const path = `${temp}.${req.file.mimetype === "application/pdf" ? "pdf" : "img"}`
    fs.renameSync(temp, path)

    try {

        const pageText =
            req.file.mimetype === "application/pdf"
                ? await extractPageText(path)
                : ""

        const result = await extractInvoice(
            path,
            req.file.mimetype,
            pageText
        )

        console.log(result)

        // const data = await extractInvoice(path, req.file.mimetype)
        res.json(result)
    } catch (e: any) {
        res.status(500).json({ error: e.message })
    }
})

export default router
