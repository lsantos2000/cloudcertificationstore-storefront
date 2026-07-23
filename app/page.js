'use client'

import { useMemo, useState } from 'react'
import { books } from './data/books'

const providers = ['All', 'Bundles', 'Microsoft', 'Google Cloud', 'AWS', 'NVIDIA', 'Anthropic', 'Cisco', 'Snowflake']

export default function Home() {
  const [provider, setProvider] = useState('All')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState([])
  const [drawer, setDrawer] = useState(false)
  const [checkoutState, setCheckoutState] = useState('idle')
  const [checkoutError, setCheckoutError] = useState('')

  const shown = useMemo(() => books.filter((book) => {
    const matchesProvider = provider === 'All' || book.provider === provider
    const haystack = `${book.title} ${book.certification} ${book.code}`.toLowerCase()
    return matchesProvider && haystack.includes(query.trim().toLowerCase())
  }), [provider, query])

  const total = cart.reduce((sum, book) => sum + book.price, 0)

  function add(book) {
    setCart((current) => [...current, book])
    setDrawer(true)
  }

  async function checkout() {
    setCheckoutState('loading')
    setCheckoutError('')
    try {
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart.map((book) => book.id) }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Checkout could not be started.')
      window.location.assign(data.url)
    } catch (error) {
      setCheckoutState('idle')
      setCheckoutError(error.message)
    }
  }

  return <main className="store-shell">
    <div className="topbar"><span>53 CURRENT CLOUD & AI TITLES</span><span>INSTANT DIGITAL DELIVERY</span><span>SECURE CHECKOUT</span></div>
    <nav><a className="logo" href="#top">cloudbound<span>.</span></a><div><a href="#catalog">EBOOKS</a><a href="#catalog">BUNDLES</a><a href="#why">WHY US</a></div><button onClick={() => setDrawer(true)}>YOUR CART <b>{cart.length}</b></button></nav>

    <section className="store-hero" id="top">
      <div><p className="label">CLOUD CERTIFICATION PRACTICE LIBRARY</p><h1>Prepare with purpose.<br/><em>Pass with confidence.</em></h1><p>Original, exam-style practice questions with clear explanations for AWS, Microsoft, Google Cloud, NVIDIA, Cisco, Snowflake, and Anthropic certifications.</p><a className="store-primary" href="#catalog">BROWSE ALL EBOOKS ↗</a></div>
      <div className="store-hero-stat"><strong>53</strong><span>EBOOKS<br/>AND BUNDLES</span><small>Grounded in the July 2026 catalog</small></div>
    </section>

    <section className="store-catalog" id="catalog">
      <header><div><p className="label">THE COMPLETE COLLECTION</p><h2>Find your next certification.</h2></div><label className="store-search"><span>SEARCH</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Exam, provider, or code"/></label></header>
      <div className="store-filters" aria-label="Filter ebooks by provider">{providers.map((item) => <button key={item} className={provider === item ? 'active' : ''} onClick={() => setProvider(item)}>{item}</button>)}</div>
      <p className="store-results">{shown.length} {shown.length === 1 ? 'TITLE' : 'TITLES'}</p>
      <div className="store-grid">{shown.map((book) => <article className="store-card" key={book.id}>
        <a className="store-cover" href={`/books/${book.id}`} aria-label={`View ${book.title}`}>{book.image ? <img src={book.image} alt={`${book.title} cover`}/> : <div><b>{book.provider}</b><strong>{book.code}</strong><span>Practice Exam Questions</span></div>}</a>
        <p className="store-provider">{book.provider} · {book.code}</p>
        <h3><a href={`/books/${book.id}`}>{book.title}</a></h3>
        <p className="store-desc">{book.tileDescription}</p>
        {book.officialUrl && <a className="store-official" href={book.officialUrl} target="_blank" rel="noreferrer">Official certification ↗</a>}
        <div className="store-buy"><strong>${book.price.toFixed(2)}</strong><button onClick={() => add(book)}>ADD TO CART ＋</button></div>
      </article>)}</div>
    </section>

    <section className="store-why" id="why"><p className="label">INDEPENDENT. PRACTICAL. AFFORDABLE.</p><h2>Built to turn exam objectives into confident decisions.</h2><div><p><b>Original practice</b><span>Exam-style questions built from public documentation and industry knowledge.</span></p><p><b>Useful explanations</b><span>Understand why an answer works—and why the alternatives do not.</span></p><p><b>Current coverage</b><span>Cloud, security, data, machine learning, and agentic AI certifications.</span></p></div></section>
    <footer><a className="logo" href="#top">cloudbound<span>.</span></a><p>Independent certification preparation. Unofficial and unaffiliated with certification providers.</p><div className="footer-disclaimer"><strong>Disclaimer:</strong> Google Cloud, Amazon Web Services (AWS), Microsoft Azure, NVIDIA, Cisco, Snowflake, Anthropic, and other certification providers featured here are trademarks of their respective owners and are used for identification only. These eBooks are independently published, unofficial, and unaffiliated resources and are not endorsed, sponsored, or associated with any certification provider.<br/><br/>All practice questions are original, exam-style content—not real exam questions or full mock exams—created using publicly available documentation and general industry knowledge, drafted with AI assistance, and reviewed by a human for accuracy and educational value. No proprietary, confidential, leaked, or real exam content is included. Materials are provided for educational purposes only; learners should verify all information against official exam guides and documentation.<br/><br/>Digital products are non-refundable—please review the available product information before purchasing.</div><small>© 2026 CLOUD CERTIFICATION STORE</small></footer>

    {drawer && <><div className="scrim" onClick={() => setDrawer(false)}/><aside><button className="close" onClick={() => setDrawer(false)}>×</button><p className="label">YOUR CART</p><h2>Ready to prepare?</h2>{cart.length ? <><div className="cart">{cart.map((book, index) => <div key={`${book.id}-${index}`}><i>{book.code}</i><p><b>{book.title}</b><small>Digital ebook</small></p><strong>${book.price.toFixed(2)}</strong><button aria-label={`Remove ${book.title}`} onClick={() => setCart(cart.filter((_, itemIndex) => itemIndex !== index))}>×</button></div>)}</div><div className="total"><span>TOTAL</span><b>${total.toFixed(2)}</b></div><button className="checkout" disabled={checkoutState === 'loading'} onClick={checkout}>{checkoutState === 'loading' ? 'OPENING CHECKOUT…' : 'CHECKOUT SECURELY ↗'}</button>{checkoutError && <p className="checkoutError" role="alert">{checkoutError}</p>}<small className="secure">SECURE PAYMENT BY STRIPE</small></> : <p>Your cart is empty. Choose an ebook to begin.</p>}</aside></>}
  </main>
}
