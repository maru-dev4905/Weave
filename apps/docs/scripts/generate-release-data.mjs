import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, '../src/data/releases.generated.json');

function runGitLog() {
  try {
    return execSync('git log --date=short --pretty=format:%H%x09%ad%x09%s%x09%an --name-only -n 60', {
      cwd: resolve(__dirname, '../../..'),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

function buildReleaseData(rawLog) {
  const commits = parseGitLog(rawLog);
  const docsCommits = commits.filter(isDocsCommit);

  if (!docsCommits.length) {
    return [
      {
        version: 'DOCS-SNAPSHOT',
        title: 'WEAVE Docs Snapshot',
        date: new Date().toISOString().slice(0, 10),
        summary: 'git 이력에서 docs 관련 변경을 읽지 못한 환경을 위한 기본 릴리스 데이터입니다.',
        groups: [
          {
            label: '문서 시스템',
            entries: [
              '기본 docs 릴리스 요약 데이터',
              '빌드 환경에서 git log 접근이 가능하면 자동 갱신됩니다.',
            ],
          },
        ],
      },
    ];
  }

  const releasesByDate = new Map();

  docsCommits.forEach((commit) => {
    if (!releasesByDate.has(commit.date)) {
      releasesByDate.set(commit.date, []);
    }

    releasesByDate.get(commit.date).push(commit);
  });

  return Array.from(releasesByDate.entries()).map(([date, commits], index) => {
    const version = `DOCS-${date.replace(/-/g, '.')}`;
    const groups = groupCommitsByCategory(commits);

    return {
      version,
      title: buildReleaseTitle(groups, commits, index),
      date,
      summary: buildReleaseSummary(groups, commits),
      groups,
    };
  });
}

function parseGitLog(rawLog) {
  if (!rawLog) {
    return [];
  }

  const entries = rawLog
    .split('\n')
    .reduce((acc, line) => {
      if (!line.trim()) {
        return acc;
      }

      if (line.includes('\t')) {
        const [hash, date, subject, author] = line.split('\t');
        acc.push({
          hash,
          date,
          subject: cleanSubject(subject),
          author,
          files: [],
        });
        return acc;
      }

      acc[acc.length - 1]?.files.push(line.trim());
      return acc;
    }, []);

  return entries.filter((entry) => entry.subject);
}

function isDocsCommit(commit) {
  if (isNoiseCommit(commit.subject)) {
    return false;
  }

  return commit.files.some((file) =>
    file.startsWith('apps/docs/') ||
    file === 'README.md' ||
    file.startsWith('packages/wv/src/images/'),
  );
}

function isNoiseCommit(subject) {
  const normalized = subject.toLowerCase();
  return normalized === 'test commit' || normalized === 'first commit' || normalized.startsWith('wip');
}

function cleanSubject(subject) {
  return String(subject || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function groupCommitsByCategory(commits) {
  const map = new Map();

  commits.forEach((commit) => {
    const category = resolveCommitCategory(commit);

    if (!map.has(category)) {
      map.set(category, []);
    }

    const nextEntries = map.get(category);
    if (!nextEntries.includes(commit.subject)) {
      nextEntries.push(commit.subject);
    }
  });

  return Array.from(map.entries()).map(([label, entries]) => ({
    label,
    entries,
  }));
}

function resolveCommitCategory(commit) {
  const subject = commit.subject.toLowerCase();
  const files = commit.files;

  if (subject.includes('release') || files.some((file) => file.includes('generate-release-data'))) {
    return '릴리스';
  }

  if (subject.includes('playground') || files.some((file) => file.includes('PlaygroundPage'))) {
    return '플레이그라운드';
  }

  if (subject.includes('tool') || files.some((file) => file.includes('ToolsPage'))) {
    return '도구';
  }

  if (subject.includes('anim') || files.some((file) => file.includes('AnimPage'))) {
    return '애니메이션';
  }

  if (subject.includes('validation') || subject.includes('form') || files.some((file) => file.includes('ValidationPage') || file.includes('FormPage'))) {
    return '폼/검증';
  }

  if (subject.includes('download') || files.some((file) => file.includes('DownloadPage'))) {
    return '다운로드';
  }

  if (subject.includes('theme') || subject.includes('home') || files.some((file) => file.includes('HomePage') || file.includes('Navbar') || file.includes('site.css'))) {
    return '브랜딩/UI';
  }

  return '문서 시스템';
}

function buildReleaseTitle(groups, commits, index) {
  const primaryGroup = groups[0]?.label || '문서 시스템';

  if (groups.length === 1) {
    return `${primaryGroup} 업데이트`;
  }

  return `${primaryGroup} 외 ${Math.max(0, groups.length - 1)}개 영역 정리`;
}

function buildReleaseSummary(groups, commits) {
  const labels = groups.map((group) => group.label);

  if (labels.length === 1) {
    return `${labels[0]} 영역의 문서와 데모 구성을 정리한 릴리스입니다.`;
  }

  return `${labels.slice(0, 3).join(', ')} 중심으로 문서 구조와 데모 흐름을 다듬은 릴리스입니다.`;
}

const rawLog = runGitLog();
const data = buildReleaseData(rawLog);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
