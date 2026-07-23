import { notFound } from 'next/navigation'
import { books } from '../../data/books'
import ContentPage from '../../components/ContentPage'

const collections = {
  all: ['Full catalog', () => true],
  google: ['Google Cloud certification guides', (book) => book.provider === 'Google Cloud'],
  aws: ['AWS certification guides', (book) => book.provider === 'AWS'],
  microsoft: ['Microsoft and Azure certification guides', (book) => book.provider === 'Microsoft'],
  nvidia: ['NVIDIA certification guides', (book) => book.provider === 'NVIDIA'],
  cisco: ['Cisco certification guides', (book) => book.provider === 'Cisco'],
  snowflake: ['Snowflake certification guides', (book) => book.provider === 'Snowflake'],
  anthropic: ['Anthropic certification guides', (book) => book.provider === 'Anthropic'],
  bundles: ['Discounted ebook bundles', (book) => book.bundle]
}

export function generateStaticParams() { return Object.keys(collections).map((slug) => ({ slug })) }

export default async function CollectionPage({ params }) {
  const { slug } = await params
  const collection = collections[slug]
  if (!collection) notFound()
  const [title, filter] = collection
  const matches = books.filter(filter)
  return <ContentPage eyebrow="BROWSE BY PROVIDER" title={title} intro={`${matches.length} original, independent preparation ${matches.length === 1 ? 'guide' : 'guides'} available for secure digital purchase.`}>
    <div className="collection-grid">{matches.map((book) => <article key={book.id}><a className="collection-cover" href={`/books/${book.id}`}>{book.image ? <img src={book.image} alt={`${book.title} cover`}/> : <strong>{book.code}</strong>}</a><p className="store-provider">{book.provider} · {book.code}</p><h3><a href={`/books/${book.id}`}>{book.title}</a></h3><p>{book.tileDescription}</p><div><strong>${book.price.toFixed(2)}</strong><a href={`/books/${book.id}`}>VIEW EBOOK →</a></div></article>)}</div>
  </ContentPage>
}
