import fs from "fs"
import fetch from "node-fetch"
import FormData from "form-data"
import OpenAI from "openai"
import { safeJsonParse } from "../utils/json.util.js"


export async function extractViaOCR(filePath: string): Promise<any | null> {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

    const fd = new FormData()
    fd.append("file", fs.createReadStream(filePath))

    const ocrRes = await fetch("http://localhost:8001/ocr", {
        method: "POST",
        body: fd as any,
    })

    const { text } = await ocrRes.json()

    const res = await openai.responses.create({
        model: "gpt-4.1",
        response_format: { type: "json_object" },
        input: [{
            role: "user",
            content: [{ type: "input_text", text }]
        }]
    })

    return res.output_parsed ?? safeJsonParse(res.output_text)
}
