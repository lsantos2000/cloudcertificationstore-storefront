import ContentPage from '../components/ContentPage'

export default function ContactPage() {
  return <ContentPage eyebrow="CONTACT" title="How can we help?" intro="For purchase, download, or product questions, include enough detail for us to identify the guide and order involved." image="/site-images/cloud-work.webp" imageAlt="Cloud professional working with digital tools">
    <div className="content-grid"><section><h3>Order support</h3><p>Reply to your Stripe receipt or delivery email with your order reference and the email address used at checkout.</p></section><section><h3>Product questions</h3><p>Tell us the certification code and what you would like to confirm before buying.</p></section><section><h3>Corrections</h3><p>Found something that needs review? Include the book title, question number, and a short explanation.</p></section></div>
    <div className="content-callout"><strong>Before contacting support</strong><p>Check your inbox and spam folder for your payment receipt and digital-delivery message. Never send passwords or complete payment-card details.</p></div>
  </ContentPage>
}
