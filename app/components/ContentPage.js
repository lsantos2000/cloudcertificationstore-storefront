import SiteFooter from './SiteFooter'

export default function ContentPage({ eyebrow, title, intro, image = '/site-images/cloud-work.webp', imageAlt = 'Cloud certification learning' , children }) {
  return <main className="content-shell">
    <nav><a className="logo" href="/">CloudCertification<span>Store</span></a><div><a href="/#catalog">EBOOKS</a><a href="/about">ABOUT</a><a href="/contact">CONTACT</a></div><a className="detail-back" href="/">← HOME</a></nav>
    <header className="content-hero"><div><p className="label">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div><img src={image} alt={imageAlt}/></header>
    <article className="content-body">{children}</article>
    <SiteFooter/>
  </main>
}
