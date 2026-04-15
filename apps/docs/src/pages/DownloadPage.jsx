import { Card } from '../components/Card.jsx';
import { Section } from '../components/Section.jsx';
import { withBase } from '../utils/withBase.js';

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

const downloadVersions = [
  {
    label: 'StarterKit',
    version: 'v1.0.0',
    buttonText: 'Download',
    href: '/downloads/publishing-starter.zip',
    variant: 'primary_button',
  },
  {
    label: 'core.js',
    version: 'v1.0.1',
    buttonText: 'Download',
    href: '/downloads/publishing-starter/core.js',
    variant: 'secondary_link_button',
  },
  {
    label: 'wv.css',
    version: 'v1.0.2',
    buttonText: 'Download',
    href: '/downloads/publishing-starter/wv.css',
    variant: 'secondary_link_button',
  },
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
            <Card className="download_card download_action_card">
              <div className="download_card_head">
                <div>
                  <span className="badge_pill">DOWNLOAD</span>
                  <h3>Download</h3>
                  <p>
                    실제 스타터 구조로 맞춘 압축 파일입니다. 내려받은 뒤 내부 구조를 확인하고,
                    Docs 가이드대로 붙여 보면서 검증을 이어갈 수 있습니다.
                  </p>
                </div>
              </div>
              <div className="download_button_group">
                {downloadVersions.map((item) => (
                  <div className="download_version_row" key={item.href}>
                    <span className="download_version_label">{item.label}</span>
                    <span className="download_version_badge">{item.version}</span>
                    <a
                      href={withBase(item.href)}
                      download
                      className={`${item.variant} download_anchor_button`}
                    >
                      {item.buttonText}
                    </a>
                  </div>
                ))}
              </div>
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
        </div>
      </Section>
    </div>
  );
}
