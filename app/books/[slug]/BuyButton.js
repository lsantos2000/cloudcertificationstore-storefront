'use client'

import { useState } from 'react'

export default function BuyButton({ bookId }) {
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')

  async function buy() {
    setState('loading')
    setError('')
    try {
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [bookId] }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Checkout could not be started.')
      window.location.assign(data.url)
    } catch (cause) {
      setState('idle')
      setError(cause.message)
    }
  }

  return <><button className="detail-buy" onClick={buy} disabled={state === 'loading'}>{state === 'loading' ? 'OPENING CHECKOUT…' : 'BUY NOW WITH STRIPE ↗'}</button>{error && <p className="checkoutError" role="alert">{error}</p>}</>
}
