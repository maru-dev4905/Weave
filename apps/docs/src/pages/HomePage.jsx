import { Link } from 'react-router-dom';

import { Card } from '../components/Card.jsx';
import { Section } from '../components/Section.jsx';

const featureCards = [
  {
    icon: 'CSS',
    title: 'Docs(CSS)',
    text: '색상, 테이블, TOC 기반으로 정리된 CSS 설명서를 바로 확인할 수 있습니다.',
  },
  {
    icon: 'JS',
    title: 'Docs(JS)',
    text: '스크립트 모듈별 사용 방법, 실시간 테스트, 코드 복사 흐름을 한 페이지에 정리했습니다.',
  },
  {
    icon: 'AN',
    title: 'Anim',
    text: 'fade와 marquee 애니메이션을 GSAP 기반으로 테스트하고 속성 규칙을 함께 확인할 수 있습니다.',
  },
  {
    icon: 'PL',
    title: 'Plate',
    text: '공통 색상 토큰을 밀도 있게 확인하고 필요한 값을 바로 복사할 수 있습니다.',
  },
  {
    icon: 'DL',
    title: 'Download',
    text: '배포용 압축 파일 구성과 다운로드 버튼만 남긴 단순한 다운로드 페이지입니다.',
  },
];

export function HomePage() {
  return (
    <div className="page_shell">
      <section className="hero_panel">
        <div className="hero_copy">
          <span className="section_eyebrow">Publishing Docs</span>
          <h1>문서와 테스트를 한 화면에 모은 퍼블리싱 허브</h1>
          <p>
            다크 톤의 문서형 레이아웃 안에서 CSS 가이드, 스크립트 모듈 데모, 색상 토큰,
            다운로드 자산까지 한 번에 탐색할 수 있도록 정리했습니다.
          </p>
          <div className="hero_actions">
            <Link to="/docs/css" className="primary_link_button">
              CSS 문서 보기
            </Link>
            <Link to="/docs/js" className="secondary_link_button">
              JS 모듈 보기
            </Link>
          </div>
        </div>

        <Card className="hero_preview_card">
          <div className="hero_preview_grid">
            <div>
              <strong>Landing</strong>
              <span>문서형 다크 UI</span>
            </div>
            <div>
              <strong>CSS</strong>
              <span>TOC + 표 중심 구조</span>
            </div>
            <div>
              <strong>JS</strong>
              <span>기능 테스트 + 코드 복사</span>
            </div>
            <div>
              <strong>ANIM</strong>
              <span>Fade + Marquee</span>
            </div>
          </div>
          <div className="hero_preview_code">
            <span>Docs(CSS)</span>
            <span>Docs(JS)</span>
            <span>Anim</span>
            <span>Plate</span>
            <span>Download</span>
          </div>
        </Card>
      </section>

      <Section
        eyebrow="Sections"
        title="필요한 자료를 바로 찾을 수 있게 구조를 단순하게 다시 정리했습니다"
        description="상단 GNB를 기준으로 역할이 분명하게 나뉘도록 재구성했고, 각 페이지는 하나의 목적에만 집중하도록 정리했습니다."
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

      <Section
        eyebrow="Quick Access"
        title="바로 이동"
        description="실제 작업 흐름에 맞춰 자주 보는 페이지를 빠르게 열 수 있도록 링크를 분리했습니다."
      >
        <div className="quick_link_grid">
          <Link to="/docs/css" className="quick_link_card surface_card">
            <strong>색상, 테이블, TOC 기반 CSS 설명서</strong>
            <span>문서 원본 느낌을 유지한 상세 가이드</span>
          </Link>
          <Link to="/docs/js" className="quick_link_card surface_card">
            <strong>모듈별 기능 테스트와 코드 복사</strong>
            <span>Copy, Tabs, Accordion, Modal, Scroll, Hide Today</span>
          </Link>
          <Link to="/anim" className="quick_link_card surface_card">
            <strong>애니메이션 모듈 테스트</strong>
            <span>Fade, Marquee, GSAP, ScrollTrigger</span>
          </Link>
          <Link to="/plate" className="quick_link_card surface_card">
            <strong>색상 토큰 탐색</strong>
            <span>토큰 값 확인과 복사</span>
          </Link>
          <Link to="/download" className="quick_link_card surface_card">
            <strong>압축 파일 다운로드</strong>
            <span>구성 안내와 단일 다운로드 버튼</span>
          </Link>
        </div>
      </Section>
    </div>
  );
}
