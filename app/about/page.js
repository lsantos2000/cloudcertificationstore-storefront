import ContentPage from '../components/ContentPage'

export default function AboutPage() {
  return <ContentPage eyebrow="ABOUT US" title="Certification preparation built for practical learning." intro="Cloud Certification Store creates accessible digital study resources for cloud, AI, data, networking, and security professionals." image="/site-images/certification-team.png" imageAlt="Cloud certification learning team">
    <h2>Our mission</h2><p>To democratize cloud expertise through affordable, focused, and current learning materials that help professionals build confidence and accelerate their careers.</p>
    <h2>What we publish</h2><p>Our downloadable guides combine original exam-style practice questions, explanations for correct and incorrect choices, readiness checklists, and links to official provider documentation.</p>
    <h2>How we work</h2><div className="content-grid"><section><h3>Practical</h3><p>Scenario-driven questions reinforce the decisions professionals make in real technical environments.</p></section><section><h3>Independent</h3><p>We are an unaffiliated publisher. Our materials are based on public objectives and documentation.</p></section><section><h3>Accessible</h3><p>Digital PDF resources let learners study on their own schedule and across their preferred devices.</p></section></div>
  </ContentPage>
}
