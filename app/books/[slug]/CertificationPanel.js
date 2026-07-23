'use client'

import { useState } from 'react'

export default function CertificationPanel({ book }) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return <aside className="certification-panel">
    <button className="certification-close" type="button" aria-label="Close certification information" onClick={() => setVisible(false)}>×</button>
    <p className="label">CERTIFICATION</p>
    <h3>{book.certification}</h3>
    <p>{book.tileDescription}</p>
    {book.officialUrl && <a href={book.officialUrl} target="_blank" rel="noreferrer">VIEW OFFICIAL CERTIFICATION ↗</a>}
  </aside>
}
