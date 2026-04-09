import releases from '../data/releases.generated.json';
import { Card } from '../components/Card.jsx';
import { Section } from '../components/Section.jsx';
import { Sidebar } from '../components/Sidebar.jsx';

const sidebarItems = [
  { href: '#overview', label: '개요' },
  ...releases.map((release) => ({
    href: `#${getReleaseAnchorId(release.version)}`,
    label: release.version,
  })),
];

export function ReleasePage() {
  return (
    <div className="page_shell page_shell_with_sidebar">
      <Sidebar title="On this page" items={sidebarItems} />

      <div className="page_content">
        <Section
          id="overview"
          eyebrow="Release"
          title="릴리스와 변경 이력"
          description="git 기록을 빌드 전에 정리한 release 데이터를 기준으로 버전, 요약, 주요 변경 사항을 문서 안에서 바로 확인할 수 있습니다."
          align="wide"
        >
          <Card className="intro_banner">
            <div>
              <strong>Source</strong>
              <span>build-time generated release data</span>
            </div>
            <div>
              <strong>Shape</strong>
              <span>version, title, date, summary, entries</span>
            </div>
            <div>
              <strong>Goal</strong>
              <span>정적 배포 환경에서도 동일한 changelog 제공</span>
            </div>
          </Card>
        </Section>

        <Section
          id="release-list"
          eyebrow="Timeline"
          title="Release Notes"
          description="최근 변경 내용을 버전 단위로 읽기 쉽게 정리했습니다."
        >
          <div className="release_list">
            {releases.map((release) => (
              <Card key={release.version} className="release_card" id={getReleaseAnchorId(release.version)}>
                <div className="release_head">
                  <div>
                    <span className="badge_pill">{release.version}</span>
                    <h3>{release.title}</h3>
                  </div>
                  <time dateTime={release.date}>{release.date}</time>
                </div>
                <p className="release_summary">{release.summary}</p>
                <ul className="check_list release_entries">
                  {release.entries.map((entry) => (
                    <li key={`${release.version}-${entry}`}>{entry}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function getReleaseAnchorId(version) {
  return `release-${String(version).replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}
