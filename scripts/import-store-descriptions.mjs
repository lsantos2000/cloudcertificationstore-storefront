import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { books } from '../app/data/books.js'

const allowedTags = new Set(['h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'blockquote', 'a', 'br'])

function sanitize(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/<\/?(?:span|div)\b[^>]*>/gi, '')
    .replace(/<(\/?)\s*([a-z0-9]+)([^>]*)>/gi, (match, closing, rawTag, attrs) => {
      const tag = rawTag.toLowerCase()
      if (!allowedTags.has(tag)) return ''
      if (closing) return tag === 'br' ? '' : `</${tag}>`
      if (tag === 'br') return '<br/>'
      if (tag === 'a') {
        const href = attrs.match(/href=["']([^"']+)["']/i)?.[1] || ''
        return /^https?:\/\//i.test(href) ? `<a href="${href.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}" target="_blank" rel="noreferrer">` : '<a>'
      }
      return `<${tag}>`
    })
    .replace(/<p>\s*(?:<br\s*\/?>\s*)+<\/p>/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

const descriptions = {}
const failures = []

function fallbackDescription(text) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const parts = escaped.split(/(?=[📄🔍✅☁️💸🛡️💡📦📘📊🧩🧾💾🎯🧠🔹])/).filter(Boolean)
  if (parts.length > 1) {
    const [intro, ...items] = parts
    return `<p>${intro}</p><ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`
  }
  return `<p>${escaped}</p>`
}

for (const [index, book] of books.entries()) {
  try {
    const response = await fetch(book.legacyUrl, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0' } })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const page = await response.text()
    const matches = [...page.matchAll(/<div class="product-description[^>]*>([\s\S]*?)<\/div><!--product-description-->/gi)]
    const candidates = matches.map((match) => sanitize(match[1])).filter((value) => value && !value.includes('{{'))
    const description = candidates.sort((a, b) => b.length - a.length)[0]
    if (!description) throw new Error('description block not found')
    descriptions[book.id] = description
    console.log(`[${index + 1}/${books.length}] ${book.id}`)
  } catch (error) {
    failures.push(`${book.id}: ${error.message}`)
    descriptions[book.id] = fallbackDescription(book.description)
    console.error(`[${index + 1}/${books.length}] FAILED ${book.id}: ${error.message}`)
  }
}

const output = `// Generated from the legacy storefront by scripts/import-store-descriptions.mjs\nexport const storeDescriptions = ${JSON.stringify(descriptions, null, 2)}\n`
await writeFile(resolve('app/data/store-descriptions.js'), output, 'utf8')

console.log(`Generated ${Object.keys(descriptions).length}/${books.length} descriptions (${failures.length} used complete catalog-text fallbacks).`)
if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
}
