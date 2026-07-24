import ContentPage from '../components/ContentPage'

const resources = [
  ['AWS certification', 'Exam guides, sample questions, and official training paths.', 'https://aws.amazon.com/certification/'],
  ['Google Cloud certification', 'Official certification paths, exam guides, and learning resources.', 'https://cloud.google.com/learn/certification'],
  ['Microsoft Credentials', 'Browse Microsoft role-based and fundamentals credentials.', 'https://learn.microsoft.com/credentials/'],
  ['NVIDIA certification', 'Official certification tracks and program information.', 'https://www.nvidia.com/en-us/learn/certification/'],
  ['Cisco certification', 'Cisco certification paths, exam topics, and training options.', 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/index.html'],
  ['Snowflake certification', 'SnowPro certification information and exam resources.', 'https://learn.snowflake.com/en/certifications/']
]

export default function FreeResourcesPage() {
  return <ContentPage eyebrow="FREE RESOURCES" title="Start with the official exam objectives." intro="Use authoritative provider materials to understand the certification, confirm current objectives, and plan your preparation." image="/site-images/google-certification.png" imageAlt="Professional studying for a cloud certification">
    <div className="resource-grid">{resources.map(([title, text, href]) => <a key={title} href={href} target="_blank" rel="noreferrer"><h3>{title}</h3><p>{text}</p><strong>OPEN OFFICIAL RESOURCE ↗</strong></a>)}</div>
    <div className="content-callout"><strong>Study responsibly</strong><p>Certification objectives change. Always compare third-party preparation material with the latest official exam guide and documentation.</p></div>
  </ContentPage>
}
