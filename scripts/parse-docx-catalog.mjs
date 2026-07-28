import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const base = 'c:/Users/sebys/Downloads/cloudcert-docx-extract/word'
const xml = readFileSync(join(base, 'document.xml'), 'utf8')
const rels = readFileSync(join(base, '_rels/document.xml.rels'), 'utf8')

const relMap = {}
for (const m of rels.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)) relMap[m[1]] = m[2]

// Extract all external links from document
const allLinks = [...xml.matchAll(/r:id="([^"]+)"/g)].map((m) => relMap[m[1]]).filter(Boolean)
const uniqueLinks = [...new Set(allLinks)]
console.log('Unique external links:', uniqueLinks.length)
uniqueLinks.forEach((l) => console.log(l))

// Extract plain text by stripping XML
const plain = xml
  .replace(/<w:tab\/>/g, '\t')
  .replace(/<w:br[^/]*\/>/g, '\n')
  .replace(/<\/w:p>/g, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/\n{3,}/g, '\n\n')

// Find book-like sections
const lines = plain.split('\n').map((l) => l.trim()).filter(Boolean)
console.log('\nTotal lines:', lines.length)

const bookLines = lines.filter((l) =>
  /Practice Exam|Bundle|eBook|Certification/i.test(l) && l.length > 20
)
console.log('\nBook-like lines:', bookLines.length)
bookLines.forEach((l) => console.log('-', l.slice(0, 150)))

// Check for embedded images in media folder
try {
  const media = readdirSync(join(base, 'media'))
  console.log('\nEmbedded media files:', media.length, media.slice(0, 10))
} catch {
  console.log('\nNo media folder')
}
