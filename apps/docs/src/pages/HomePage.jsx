import { Link } from 'react-router-dom';

import { Card } from '../components/Card.jsx';
import { Section } from '../components/Section.jsx';

const featureCards = [
  {
    icon: 'UT',
    title: 'Utility CSS System',
    text: '재사용 가능한 spacing, color, display, typography 유틸리티로 빠르게 화면을 조립합니다.',
  },
  {
    icon: 'PL',
    title: 'Plugin Architecture',
    text: 'setup, scan, mount, unmount, teardown 라이프사이클을 기준으로 UI 동작을 구조화합니다.',
  },
  {
    icon: 'UI',
    title: 'Component Library',
    text: '사내 프로젝트에서 반복되는 헤더와 패턴을 라이브러리처럼 공유하고 문서화합니다.',
  },
  {
    icon: 'ST',
    title: 'Starter Kit Generator',
    text: '기본 템플릿과 커스텀 옵션을 조합해 시작 프로젝트를 빠르게 구성할 수 있게 만듭니다.',
  },
];

export function HomePage() {
  return (
    <div className="page_shell">
      <section className="hero_panel">
        <div className="hero_copy">
          <span className="section_eyebrow">WEAVE</span>
          <h1>Frontend Publishing Framework</h1>
          <p>
            Utility CSS + Plugin Runtime + UI Library for fast and scalable frontend
            development.
          </p>
          <div className="hero_actions">
            <Link to="/docs" className="primary_link_button">
              Explore Docs
            </Link>
            <Link to="/download" className="secondary_link_button">
              Starter Kit
            </Link>
          </div>
        </div>

        <Card className="hero_preview_card">
          <div className="hero_preview_grid">
            <div>
              <strong>CSS</strong>
              <span>Utility system</span>
            </div>
            <div>
              <strong>JS</strong>
              <span>Runtime plugins</span>
            </div>
            <div>
              <strong>UI</strong>
              <span>Reusable patterns</span>
            </div>
          </div>
          <div className="hero_preview_code">
            <span>createWeave()</span>
            <span>copyPlugin()</span>
            <span>tabsPlugin()</span>
            <span>accordionPlugin()</span>
          </div>
        </Card>
      </section>

      <Section
        eyebrow="Features"
        title="빠르게 만들고, 반복하고, 문서화하기 위한 사내 프레임워크"
        description="퍼블리셔와 프론트엔드 개발자가 같은 설계 언어로 작업할 수 있도록 CSS, JS, UI 자산을 한곳에 정리합니다."
      >
        <div className="feature_grid">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="feature_card">
              <div className="feature_icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
