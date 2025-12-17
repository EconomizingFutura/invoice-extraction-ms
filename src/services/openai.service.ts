import fs from "fs"
import { safeJsonParse } from "../utils/json.util.js"
import { getParsedOutput } from "../utils/openai.util.js"
import OpenAI from "openai"
import type { RawInvoice } from "../types/raw-invoice.types.js"

const PROMPT = `
You are a GST invoice extraction system.

Extract ONLY:
clientName, clientAddress, invoiceNumber, invoiceDate,
totalAmount, taxableValue, cgst, sgst, igst,
gstNumber, panNumber, hsnSacCode, serviceDescription

Rules:
- Return ONLY JSON
- No markdown
- Missing → null
`

export async function extractFromImage(
    imagePath: string,
    mimeType: string
): Promise<RawInvoice | null> {

    const base64 = fs.readFileSync(imagePath).toString("base64")
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

    const response = await openai.responses.create({
        model: "gpt-4.1",
        input: [
            {
                role: "user",
                content: [
                    { type: "input_text", text: PROMPT },
                    {
                        type: "input_image",
                        image_url: `data:${mimeType};base64,${base64}`,
                        detail: "high",
                    },
                ],
            },
        ],
    })

    const raw = getParsedOutput(response)
    return typeof raw === "string" ? safeJsonParse(raw) : raw
}

export async function extractFromPDF(
    pdfPath: string
): Promise<RawInvoice | null> {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

    const uploaded = await openai.files.create({
        file: fs.createReadStream(pdfPath),
        purpose: "assistants",
    })

    const response = await openai.responses.create({
        model: "gpt-4.1",
        input: [
            {
                role: "user",
                content: [
                    { type: "input_text", text: PROMPT },
                    { type: "input_file", file_id: uploaded.id },
                ],
            },
        ],
    })

    const raw = getParsedOutput(response)
    return typeof raw === "string" ? safeJsonParse(raw) : raw
}
