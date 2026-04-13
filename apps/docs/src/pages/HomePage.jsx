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
    text: 'fade, parallax, cascade, marquee, ticker, count 애니메이션을 GSAP 기반으로 테스트할 수 있습니다.',
  },
  {
    icon: 'TL',
    title: 'Tools',
    text: 'px to vw, px to rem, img to webp 같은 실무형 변환 도구를 문서 앱 안에서 바로 실행할 수 있습니다.',
  },
  {
    icon: 'PG',
    title: 'Playground',
    text: 'HTML을 직접 입력하고 preview 루트에서만 마운트해 빠르게 실험할 수 있습니다.',
  },
  {
    icon: 'VD',
    title: 'Validation',
    text: '폼 유효성 검증 규칙과 메시지 타겟 구조를 모듈 문서 형태로 바로 확인할 수 있습니다.',
  },
  {
    icon: 'FM',
    title: 'Form',
    text: '문의 폼과 가입 폼 예시로 실제 submit 흐름과 에러 처리 UX를 한 화면에서 테스트할 수 있습니다.',
  },
  {
    icon: 'PL',
    title: 'Plate',
    text: '공통 색상 토큰을 밀도 있게 확인하고 필요한 값을 바로 복사할 수 있습니다.',
  },
  {
    icon: 'RL',
    title: 'Release',
    text: '빌드 전에 생성한 changelog 데이터를 기준으로 버전별 변경 이력을 확인할 수 있습니다.',
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
      <section className="hero_panel hero_panel_home">
        <div className="hero_copy hero_copy_home">
          <h1 className="hero_brand_title">
            <span className="hero_brand_word">WEAVE</span>
          </h1>
          <p>웹을 짜는 가장 실전적인 방식으로, 문서 확인부터 데모 검증과 도구 실행, 스타터 다운로드까지 한 흐름으로 이어집니다.</p>
          <div className="hero_actions">
            <Link to="/docs/css" className="primary_link_button">
              CSS Docs
            </Link>
            <Link to="/docs/js" className="secondary_link_button">
              JS Docs
            </Link>
            <Link to="/download" className="secondary_link_button">
              Download
            </Link>
          </div>
        </div>
      </section>

      <Section
        eyebrow="WEAVE"
        title="자주 쓰는 흐름만 짧고 명확하게 묶었습니다"
        description="문서, 테스트, 도구, 다운로드를 중심으로 각 페이지의 목적이 바로 보이도록 정리했습니다."
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
        eyebrow="바로가기"
        title="바로 이동"
        description="문서 확인, 실험, 변환, 배포 흐름에서 자주 여는 페이지를 바로 이동할 수 있습니다."
      >
        <div className="quick_link_grid">
          <Link to="/docs/css" className="quick_link_card surface_card">
            <strong>CSS 문서</strong>
            <span>토큰, 유틸리티, 구조 가이드</span>
          </Link>
          <Link to="/docs/js" className="quick_link_card surface_card">
            <strong>JS 문서</strong>
            <span>모듈 데모와 코드 복사</span>
          </Link>
          <Link to="/anim" className="quick_link_card surface_card">
            <strong>Anim 테스트</strong>
            <span>Fade, Parallax, Cascade, Count</span>
          </Link>
          <Link to="/tools" className="quick_link_card surface_card">
            <strong>Tools</strong>
            <span>PX, REM, WEBP 변환</span>
          </Link>
          <Link to="/playground" className="quick_link_card surface_card">
            <strong>Playground</strong>
            <span>HTML 편집과 preview 실험</span>
          </Link>
          <Link to="/validation" className="quick_link_card surface_card">
            <strong>Validation 문서</strong>
            <span>필드, 그룹, 메시지 규칙</span>
          </Link>
          <Link to="/form" className="quick_link_card surface_card">
            <strong>Form 데모</strong>
            <span>문의/가입 submit 흐름</span>
          </Link>
          <Link to="/plate" className="quick_link_card surface_card">
            <strong>Plate</strong>
            <span>토큰 값 확인과 복사</span>
          </Link>
          <Link to="/release" className="quick_link_card surface_card">
            <strong>Release</strong>
            <span>버전별 변경 이력</span>
          </Link>
          <Link to="/download" className="quick_link_card surface_card">
            <strong>Download</strong>
            <span>스타터 파일과 구성 안내</span>
          </Link>
        </div>
      </Section>
    </div>
  );
}
