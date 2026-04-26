import { Link, Navigate, useParams } from 'react-router-dom';

import { Section } from '../components/Section.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { AssetNamingDownloaderTool } from './tools/AssetNamingDownloaderTool.jsx';
import { ImgToWebpTool } from './tools/ImgToWebpTool.jsx';
import { PluginAttributeLinterTool } from './tools/PluginAttributeLinterTool.jsx';
import { PxToRemTool } from './tools/PxToRemTool.jsx';
import { PxToVwTool } from './tools/PxToVwTool.jsx';
import { StarterPresetGeneratorTool } from './tools/StarterPresetGeneratorTool.jsx';
import { ValidationRuleBuilderTool } from './tools/ValidationRuleBuilderTool.jsx';

const tools = [
  { id: 'px-to-vw', title: 'PX to VW', summary: 'px와 vw를 상호 변환하고 CSS 문자열도 한 번에 바꿀 수 있습니다.' },
  { id: 'px-to-rem', title: 'PX to REM', summary: 'base font-size 기준으로 px와 rem을 바로 계산합니다.' },
  { id: 'img-to-webp', title: 'IMG to WEBP', summary: '이미지를 WebP로 변환하고 개별 또는 ZIP으로 내려받을 수 있습니다.' },
  { id: 'plugin-attribute-linter', title: 'Plugin Attribute Linter', summary: 'HTML의 data-weave-* 속성을 점검해 플러그인 규칙 누락을 찾습니다.' },
  { id: 'starter-preset-generator', title: 'Starter Preset Generator', summary: '선택한 플러그인 조합으로 starter kit preset 코드를 생성합니다.' },
  { id: 'validation-rule-builder', title: 'Validation Rule Builder', summary: '폼 필드 규칙을 입력하면 validation 설정 객체를 만들어줍니다.' },
  { id: 'asset-naming-helper', title: 'Asset Naming Downloader', summary: '파일 업로드 후 파일명을 일괄 변경하고 ZIP으로 내려받을 수 있습니다.' },
];

export function ToolsPage() {
  const { toolId } = useParams();
  const activeTool = toolId ? tools.find((tool) => tool.id === toolId) : null;

  if (toolId && !activeTool) {
    return <Navigate to="/tools" replace />;
  }

  return (
    <div className="page_shell page_shell_with_sidebar">
      <Sidebar
        title="이 페이지에서"
        items={[
          { href: activeTool ? '/tools' : '#tools-list', label: '도구 목록' },
          ...tools.map((tool) => ({ href: `/tools/${tool.id}`, label: tool.title, depth: 2 })),
        ]}
      />

      <div className="page_content">
        {!activeTool ? (
          <>
            <Section
              id="overview"
              eyebrow="도구"
              title="개발과 퍼블리싱 작업을 돕는 보조 도구"
              description="반복적으로 계산하거나 변환하는 작업을 문서 앱 안에서 바로 처리할 수 있습니다."
              align="wide"
            />

            <Section id="tools-list" eyebrow="목록" title="도구 목록" description="필요한 도구를 선택해 보다 빠르게 처리해보세요.">
              <div className="tools_list_grid">
                {tools.map((tool) => (
                  <Link key={tool.id} to={`/tools/${tool.id}`} className={activeTool?.id === tool.id ? 'tools_list_card is_active' : 'tools_list_card'}>
                    <strong>{tool.title}</strong>
                    <p>{tool.summary}</p>
                  </Link>
                ))}
              </div>
            </Section>
          </>
        ) : null}

        {activeTool ? (
          <Section id="tool-detail" eyebrow="도구" title={activeTool.title}>
            <ToolRenderer toolId={activeTool.id} />
          </Section>
        ) : null}
      </div>
    </div>
  );
}

function ToolRenderer({ toolId }) {
  if (toolId === 'px-to-vw') return <PxToVwTool />;
  if (toolId === 'px-to-rem') return <PxToRemTool />;
  if (toolId === 'img-to-webp') return <ImgToWebpTool />;
  if (toolId === 'plugin-attribute-linter') return <PluginAttributeLinterTool />;
  if (toolId === 'starter-preset-generator') return <StarterPresetGeneratorTool />;
  if (toolId === 'validation-rule-builder') return <ValidationRuleBuilderTool />;
  if (toolId === 'asset-naming-helper') return <AssetNamingDownloaderTool />;
  return null;
}
