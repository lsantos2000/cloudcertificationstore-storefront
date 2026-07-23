import './styles.css'

export const metadata = { title: 'Cloudbound — Pass the cloud exam', description: 'Practical cloud certification ebooks for AWS, Azure, and Google Cloud.' }

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>
}
