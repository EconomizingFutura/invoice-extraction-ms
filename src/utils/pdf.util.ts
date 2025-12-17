import fs from "fs"
import path from "path"
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs"
import { convert } from "pdf-poppler"

/**
 * Detect whether a PDF is scanned (image-only) or digital
 * Node-safe version (worker disabled)
 */
export async function isScannedPDF(filePath: string): Promise<boolean> {
  const data = new Uint8Array(fs.readFileSync(filePath))

  const doc = await pdfjs.getDocument({
    data,
    //disableWorker: true, // ✅ REQUIRED FOR NODE
  }).promise

  let text = ""

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()

    for (const item of content.items as any[]) {
      if (item.str) text += item.str
    }

    // Enough text → digital PDF
    if (text.length > 50) {
      return false
    }
  }

  return true // scanned PDF
}

/**
 * Convert scanned PDF → PNG images
 */
export async function pdfToImages(pdfPath: string): Promise<string[]> {
  const outDir = pdfPath.replace(".pdf", "_pages")

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir)
  }

  await convert(pdfPath, {
    format: "png",
    out_dir: outDir,
    out_prefix: "page",
    page: null,
  })

  return fs.readdirSync(outDir)
    .filter(f => f.endsWith(".png"))
    .map(f => path.join(outDir, f))
}
