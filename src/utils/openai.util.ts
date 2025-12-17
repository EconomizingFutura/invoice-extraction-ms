export function getParsedOutput(response: any): any | null {
  if (response?.output_parsed) return response.output_parsed
  if (response?.output_text) return response.output_text
  return null
}
