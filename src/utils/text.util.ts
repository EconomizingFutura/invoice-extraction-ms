import fs from "fs"
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs"

export async function extractPageText(pdfPath: string): Promise<string> {
  const data = new Uint8Array(fs.readFileSync(pdfPath))
  const doc = await pdfjs.getDocument({ data }).promise

  let text = ""

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()

    for (const item of content.items as any[]) {
      if (item.str) text += item.str + " "
    }
  }

  return text
}
