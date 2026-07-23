'use client'

import { useState } from 'react'

export default function BuyButton({ bookId }) {
  const [added, setAdded] = useState(false)

  function addToCart() {
    const current = JSON.parse(localStorage.getItem('cloudbound-cart') || '[]')
    localStorage.setItem('cloudbound-cart', JSON.stringify([...current, bookId]))
    setAdded(true)
  }

  return <div className="detail-cart-actions"><button className="detail-buy" onClick={addToCart}>{added ? 'ADDED TO CART ✓' : 'ADD TO CART ＋'}</button>{added && <a href="/?cart=open">VIEW CART ↗</a>}</div>
}
