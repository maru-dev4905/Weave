import { Card } from '../components/Card.jsx';
import { Section } from '../components/Section.jsx';

const downloadItems = [
  'index.html',
  'common.css',
  'wv.css',
  'core.js',
  'README.md',
];

export function DownloadPage() {
  return (
    <div className="page_shell">
      <Section
        eyebrow="Download"
        title="스타터 압축 파일 다운로드"
        description="상단 타이틀 영역, 파일 구성 안내, 다운로드 버튼만 남긴 단순한 구조로 정리했습니다."
        align="wide"
      >
        <div className="download_single_stack">
          <Card className="download_hero_card">
            <span className="badge_pill">ZIP FILE</span>
            <h3>퍼블리싱 시작용 기본 압축 파일</h3>
            <p>
              자주 쓰는 기본 파일만 담은 단일 압축 파일입니다. 별도 옵션 선택 없이 바로
              내려받을 수 있도록 구성했습니다.
            </p>
          </Card>

          <Card className="download_card">
            <div className="download_card_head">
              <div>
                <span className="badge_pill">CONTENTS</span>
                <h3>압축 파일 구성</h3>
                <p>기본 마크업, 스타일, 스크립트, 안내 문서를 함께 제공합니다.</p>
              </div>
            </div>
            <ul className="check_list">
              {downloadItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>

          <Card className="download_card download_action_card">
            <div className="download_card_head">
              <div>
                <span className="badge_pill">DOWNLOAD</span>
                <h3>바로 다운로드</h3>
                <p>단일 압축 파일을 클릭 한 번으로 받을 수 있습니다.</p>
              </div>
            </div>
            <a
              href="/downloads/publishing-starter.zip"
              download
              className="primary_button download_anchor_button"
            >
              압축 파일 다운로드
            </a>
          </Card>
        </div>
      </Section>
    </div>
  );
}
