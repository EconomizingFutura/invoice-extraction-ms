import { isScannedPDF } from "../utils/pdf.util.js"
import { scoreInvoice } from "./confidence.service.js"
import { extractFromImage, extractFromPDF } from "./openai.service.js"

export async function extractInvoice(
  filePath: string,
  mimeType: string,
  pageText: string
) {
  let raw = null

  if (mimeType.startsWith("image/")) {
    raw = await extractFromImage(filePath, mimeType)
  }

  else if (mimeType === "application/pdf") {
    const scanned = await isScannedPDF(filePath)

    if (scanned) {
      throw new Error("Scanned PDF must be converted to image first")
    }

    raw = await extractFromPDF(filePath)
  }

  console.log("Raw extraction result:", raw)

  if (!raw) return null

  // 🔥 THIS IS WHERE CONFIDENCE IS ADDED
  return scoreInvoice(raw, pageText)
}
