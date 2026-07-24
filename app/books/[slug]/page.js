import { notFound } from 'next/navigation'
import { books, getBook } from '../../data/books'
import { storeDescriptions } from '../../data/store-descriptions'
import { bundleDescriptions } from '../../data/bundle-descriptions'
import { descriptionCorrections } from '../../data/description-corrections'
import BuyButton from './BuyButton'
import CertificationPanel from './CertificationPanel'
import SiteFooter from '../../components/SiteFooter'

function BookDescription({ book }) {
  const richDescription = descriptionCorrections[book.id] || bundleDescriptions[book.id] || storeDescriptions[book.id]
  if (!book.descriptionSections && richDescription) {
    return <div className="book-description rich-description" dangerouslySetInnerHTML={{ __html: richDescription }}/>
  }
  if (!book.descriptionSections) {
    return book.description.split(/(?=✅|🔹|🎯|🧠)|(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)
  }

  return <div className="book-description">{book.descriptionSections.map((section, index) => {
    if (section.type === 'notice') return <aside className="book-notice" key={index}><strong>{section.title}</strong><p>{section.text}</p></aside>
    if (section.type === 'list') return <section className="book-section" key={index}><h3>{section.title}</h3><ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul></section>
    if (section.type === 'link') return <p key={index}><a className="book-inline-link" href={section.url} target="_blank" rel="noreferrer">{section.text} ↗</a></p>
    return <p key={index}>{section.text}</p>
  })}</div>
}

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.id }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const book = getBook(slug)
  return book ? { title: `${book.code} Practice eBook — Cloudbound`, description: book.tileDescription } : {}
}

export default async function BookPage({ params }) {
  const { slug } = await params
  const book = getBook(slug)
  if (!book) notFound()
  return <main className="detail-shell">
    <nav><a className="logo" href="/">CloudBound Guides</a><div><a href="/#catalog">ALL EBOOKS</a><a href="/#why">WHY US</a></div><a className="detail-back" href="/#catalog">← BACK TO CATALOG</a></nav>
    <section className="detail-hero">
      <div className="detail-cover">{book.image ? <img src={book.image} alt={`${book.title} cover`}/> : <div><b>{book.provider}</b><strong>{book.code}</strong><span>Practice Exam Questions</span></div>}</div>
      <div className="detail-copy"><p className="store-provider">{book.provider} · {book.code}</p><h1>{book.title}</h1><p className="detail-intro">{book.tileDescription}</p><div className="detail-price"><strong>${book.price.toFixed(2)}</strong><span>Digital ebook · Instant delivery</span></div><BuyButton bookId={book.id}/><small>Secure payment processed by Stripe.</small></div>
    </section>
    <section className="detail-body"><article><p className="label">ABOUT THIS EBOOK</p><h2>Prepare for {book.certification}.</h2><BookDescription book={book}/></article><CertificationPanel book={book}/></section>
    <section className="detail-note"><b>Independent preparation material</b><p>This is an unofficial, unaffiliated educational resource. Certification provider names and marks are used for identification only.</p></section>
    <footer><a className="logo" href="/">cloudbound<span>.</span></a><p>Original exam-style practice for cloud and AI certifications.</p><div className="footer-disclaimer"><strong>Disclaimer:</strong> Google Cloud, Amazon Web Services (AWS), Microsoft Azure, NVIDIA, Cisco, Snowflake, Anthropic, and other certification providers featured here are trademarks of their respective owners and are used for identification only. These eBooks are independently published, unofficial, and unaffiliated resources and are not endorsed, sponsored, or associated with any certification provider.<br/><br/>All practice questions are original, exam-style content—not real exam questions or full mock exams—created using publicly available documentation and general industry knowledge, drafted with AI assistance, and reviewed by a human for accuracy and educational value. No proprietary, confidential, leaked, or real exam content is included. Materials are provided for educational purposes only; learners should verify all information against official exam guides and documentation.<br/><br/>Digital products are non-refundable—please review the available product information before purchasing.</div><small>© 2026 CLOUD CERTIFICATION STORE</small></footer>
    <SiteFooter/>
  </main>
}
