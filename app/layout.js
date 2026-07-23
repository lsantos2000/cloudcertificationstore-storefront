import './styles.css'
import './stripe.css'

export const metadata = { title: 'Cloudbound — Cloud Certification Practice eBooks', description: 'Original practice exam question ebooks for AWS, Microsoft, Google Cloud, NVIDIA, Cisco, Snowflake, and Anthropic certifications.' }

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>
}
