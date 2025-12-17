import fs from "fs"

export function safeUnlink(path: string) {
  try {
    if (fs.existsSync(path)) fs.unlinkSync(path)
  } catch {}
}
