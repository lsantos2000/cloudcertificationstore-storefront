const links = [
  ['About', '/about'], ['Contact Us', '/contact'], ['Our Brand', '/brand'], ['Testimonials', '/testimonials'], ['Terms of Purchase', '/terms'],
  ['Full Catalog', '/#catalog'], ['Google', '/collections/google'], ['AWS', '/collections/aws'], ['Microsoft / Azure', '/collections/microsoft'],
  ['NVIDIA', '/collections/nvidia'], ['Cisco', '/collections/cisco'], ['Snowflake', '/collections/snowflake'], ['Anthropic', '/collections/anthropic'],
  ['Bundles', '/collections/bundles'], ['Free Resources', '/free-resources']
]

export default function SiteFooter() {
  return <footer className="site-footer">
    <a className="logo" href="/">CloudCertification<span>Store</span></a>
    <p>© Copyright 2026 Cloud Certification Store, a Global Test Preparation company. All Rights Reserved.</p>
    <nav className="footer-links" aria-label="Footer navigation">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
    <div className="footer-disclaimer"><strong>Disclaimer:</strong> Amazon Web Services (AWS), Microsoft Cloud, Microsoft Azure, Azure, Google Cloud, NVIDIA, Cisco, Snowflake, Anthropic, and any other provider showcased here are trademarks of their respective owners and are used for identification only. <strong>These eBooks are independently published, unofficial, and unaffiliated</strong> resources and are not endorsed, sponsored, or associated with any certification provider. All practice questions are <strong>original, exam-style content</strong>—not real exam questions or full mock exams—created using publicly available documentation and general industry knowledge, drafted with AI assistance, and reviewed by a human for accuracy and educational value. No proprietary, confidential, or real exam content is included. Materials are provided for educational purposes only; learners should verify all information against official exam guides and documentation. <strong>Digital products are non-refundable—please review the product information before purchasing.</strong></div>
  </footer>
}
