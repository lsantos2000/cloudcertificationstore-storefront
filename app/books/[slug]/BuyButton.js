'use client'

import { useEffect, useState } from 'react'

export default function BuyButton({ bookId }) {
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem('ccs-cart') || localStorage.getItem('cloudbound-cart') || '[]')
    setAdded(current.includes(bookId))
  }, [bookId])

  function addToCart() {
    const current = JSON.parse(localStorage.getItem('ccs-cart') || localStorage.getItem('cloudbound-cart') || '[]')
    if (current.includes(bookId)) return
    localStorage.setItem('ccs-cart', JSON.stringify([...current, bookId]))
    setAdded(true)
  }

  return <div className="detail-cart-actions"><button className="detail-buy" disabled={added} onClick={addToCart}>{added ? 'IN CART ✓' : 'ADD TO CART ＋'}</button>{added && <a href="/?cart=open">VIEW CART ↗</a>}</div>
}
