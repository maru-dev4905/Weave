import { Card } from '../components/Card.jsx';
import { Section } from '../components/Section.jsx';
import { withBase } from '../utils/withBase.js';

const downloadItems = [
  'index.html',
  'public/js/core.js',
  'public/js/prj.js',
  'public/css/wv.css',
  'public/css/common.css',
  'public/css/admin.css',
  'public/css/gov.css',
  'public/css/prj.css',
];

const starterHighlights = [
  '빈 프로젝트에 바로 붙일 수 있는 최소 시작 구조',
  'CSS 자산과 런타임 스크립트를 분리한 정적 퍼블리싱 기준 폴더 구성',
  '퍼블리셔가 첫 화면부터 손대기 쉬운 WEAVE 전용 index 진입 페이지',
];

const starterStructure = `public/
├─ js/
│  └─ core.js
│  └─ prj.js
├─ css/
│  ├─ admin.css
│  ├─ common.css
│  ├─ gov.css
│  ├─ prj.css
│  └─ wv.css
├─ plugins/
└─ images/
   ├─ common/
   ├─ samples/
   ├─ icons/
   └─ visuals/
index.html`;

const starterIndexNotes = [
  '초기 빌드 결과물처럼 바로 열리는 단일 시작 페이지',
  'WEAVE의 직조감이 더 눈에 띄도록 움직이는 라인과 오브를 강화한 모션 배경',
  '프로젝트 전용 오버라이드 진입점인 `prj.css`, `prj.js`를 포함한 베이스 화면',
];

export function DownloadPage() {
  return (
    <div className="page_shell">
      <Section
        eyebrow="Download"
        title="스타터 압축 파일 다운로드"
        description="검증용 스타터 킷을 바로 내려받고, 내부 폴더 구조와 시작 페이지 구성을 한 화면에서 확인할 수 있도록 정리했습니다."
        align="wide"
      >
        <div className="download_single_stack">
          <div className="download_grid download_intro_grid">
            <Card className="download_hero_card">
              <span className="badge_pill">ZIP FILE</span>
              <h3>퍼블리싱 시작용 기본 압축 파일</h3>
              <p>
                퍼블리셔가 바로 화면을 짜기 시작할 수 있도록, WEAVE의 기본 CSS 자산과
                런타임 스크립트만 먼저 담은 검증용 스타터 킷입니다.
              </p>
              <ul className="check_list download_check_list">
                {starterHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card className="code_block download_tree_card">
              <div className="code_block_head download_tree_head">
                <div>
                  <span className="badge_pill">STRUCTURE</span>
                  <h3>스타터 폴더 구조</h3>
                  <p>
                    다운로드한 ZIP은 아래 구조를 기준으로 맞췄습니다. 정적 퍼블리싱
                    프로젝트에 그대로 옮기기 쉬운 형태입니다.
                  </p>
                </div>
              </div>
              <pre className="download_tree_pre">
                <code>{starterStructure}</code>
              </pre>
            </Card>
          </div>

          <div className="download_grid">
            <Card className="download_card">
              <div className="download_card_head">
                <div>
                  <span className="badge_pill">CONTENTS</span>
                  <h3>ZIP 포함 파일</h3>
                  <p>실제 검증에 바로 필요한 진입 페이지와 기본 자산만 먼저 담았습니다.</p>
                </div>
              </div>
              <ul className="check_list">
                {downloadItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card className="download_card">
              <div className="download_card_head">
                <div>
                  <span className="badge_pill">INDEX</span>
                  <h3>기본 index 페이지</h3>
                  <p>
                    React나 Vue를 처음 빌드했을 때처럼, 첫 진입에서 브랜드와 시작점을 바로
                    보여주는 WEAVE 전용 랜딩 페이지를 포함했습니다.
                  </p>
                </div>
              </div>
              <ul className="check_list">
                {starterIndexNotes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          </div>

          <Card className="download_card download_action_card">
            <div className="download_card_head">
              <div>
                <span className="badge_pill">DOWNLOAD</span>
                <h3>바로 다운로드</h3>
                <p>
                  실제 스타터 구조로 맞춘 압축 파일입니다. 내려받은 뒤 내부 구조를 확인하고,
                  Docs 가이드대로 붙여 보면서 검증을 이어갈 수 있습니다.
                </p>
              </div>
            </div>
            <a
              href={withBase('/downloads/publishing-starter.zip')}
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
