import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, '../src/data/releases.generated.json');

function runGitLog() {
  try {
    return execSync('git log --date=short --pretty=format:%H%x09%ad%x09%s -n 24', {
      cwd: resolve(__dirname, '../../..'),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

function buildReleaseData(rawLog) {
  const lines = rawLog ? rawLog.split('\n').filter(Boolean) : [];

  if (!lines.length) {
    return [
      {
        version: '0.1.0',
        title: 'WEAVE Docs Snapshot',
        date: new Date().toISOString().slice(0, 10),
        summary: 'git 로그를 읽지 못한 환경을 위한 기본 release 데이터입니다.',
        entries: [
          '기본 docs 릴리스 요약 데이터',
          '빌드 환경에서 git log 접근이 가능하면 자동 갱신됩니다.',
        ],
      },
    ];
  }

  const groups = [];

  lines.forEach((line, index) => {
    const [, date, subject] = line.split('\t');
    const releaseIndex = Math.floor(index / 6);

    if (!groups[releaseIndex]) {
      const version = `0.1.${Math.max(0, lines.length - releaseIndex)}`;
      groups[releaseIndex] = {
        version,
        title: subject || `Release ${version}`,
        date,
        summary: `${subject || 'WEAVE 업데이트'}를 포함한 변경 묶음입니다.`,
        entries: [],
      };
    }

    groups[releaseIndex].entries.push(subject);
  });

  return groups;
}

const rawLog = runGitLog();
const data = buildReleaseData(rawLog);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
