import { notFound } from 'next/navigation'
import { books, getBook } from '../../data/books'
import BuyButton from './BuyButton'

function BookDescription({ book }) {
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
    <nav><a className="logo" href="/">cloudbound<span>.</span></a><div><a href="/#catalog">ALL EBOOKS</a><a href="/#why">WHY US</a></div><a className="detail-back" href="/#catalog">← BACK TO CATALOG</a></nav>
    <section className="detail-hero">
      <div className="detail-cover">{book.image ? <img src={book.image} alt={`${book.title} cover`}/> : <div><b>{book.provider}</b><strong>{book.code}</strong><span>Practice Exam Questions</span></div>}</div>
      <div className="detail-copy"><p className="store-provider">{book.provider} · {book.code}</p><h1>{book.title}</h1><p className="detail-intro">{book.tileDescription}</p><div className="detail-price"><strong>${book.price.toFixed(2)}</strong><span>Digital ebook · Instant delivery</span></div><BuyButton bookId={book.id}/><small>Secure payment processed by Stripe.</small></div>
    </section>
    <section className="detail-body"><article><p className="label">ABOUT THIS EBOOK</p><h2>Prepare for {book.certification}.</h2><BookDescription book={book}/></article><aside><p className="label">CERTIFICATION</p><h3>{book.certification}</h3><p>{book.tileDescription}</p>{book.officialUrl && <a href={book.officialUrl} target="_blank" rel="noreferrer">VIEW OFFICIAL CERTIFICATION ↗</a>}</aside></section>
    <section className="detail-note"><b>Independent preparation material</b><p>This is an unofficial, unaffiliated educational resource. Certification provider names and marks are used for identification only.</p></section>
    <footer><a className="logo" href="/">cloudbound<span>.</span></a><p>Original exam-style practice for cloud and AI certifications.</p><small>© 2026 CLOUD CERTIFICATION STORE</small></footer>
  </main>
}
