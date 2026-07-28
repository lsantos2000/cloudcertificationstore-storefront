import './styles.css'
import './stripe.css'

export const metadata = { title: 'Cloud Certification Store — Get It Done Certified eBooks', description: 'Official storefront for Get It Done Certified practice exam question eBooks. AWS, Microsoft Azure, Google Cloud, NVIDIA, Cisco, Snowflake, and Anthropic certifications.' }

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>
}
