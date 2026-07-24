import ContentPage from '../components/ContentPage'

const testimonials = [
  ['Confidence through repetition', 'Repeated practice reduced exam-day stress and helped me work through the questions with confidence.', 'Verified buyer · Network engineer'],
  ['Focused preparation that helped', 'The practice material was clear, affordable, and more useful to my preparation than several alternatives I had tried.', 'Verified buyer · Developer'],
  ['Explanations made the difference', 'Reviewing why each option was right or wrong helped me understand the technology instead of memorizing answers.', 'Certification learner']
]

export default function TestimonialsPage() {
  return <ContentPage eyebrow="LEARNER STORIES" title="Built for the moment preparation turns into confidence." intro="Feedback from professionals using our independent practice resources." image="/site-images/cloud-engineer.png" imageAlt="Cloud engineer preparing for certification">
    <div className="testimonial-grid">{testimonials.map(([title, quote, by]) => <blockquote key={title}><h3>{title}</h3><p>“{quote}”</p><cite>{by}</cite></blockquote>)}</div>
    <p className="content-note">Testimonials describe individual experiences and do not guarantee certification results.</p>
  </ContentPage>
}
