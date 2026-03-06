import { Card } from '../components/Card.jsx';
import { Section } from '../components/Section.jsx';

const starterItems = ['index.html', 'wv.css', 'common.css', 'core.js'];
const pluginOptions = ['copy', 'tabs', 'accordion', 'modal'];

export function DownloadPage() {
  return (
    <div className="page_shell">
      <Section
        eyebrow="Download"
        title="WEAVE Starter Kit 다운로드"
        description="현재는 UI만 구현되어 있으며, 이후 기본 스타터와 커스텀 스타터를 zip으로 생성하는 흐름으로 확장할 수 있습니다."
        align="wide"
      >
        <div className="download_grid">
          <Card className="download_card">
            <div className="download_card_head">
              <span className="badge_pill">Basic Starter</span>
              <h3>빠르게 시작하는 기본 템플릿</h3>
              <p>가장 기본적인 퍼블리싱 시작 파일을 포함한 스타터 구성을 제공합니다.</p>
            </div>
            <ul className="check_list">
              {starterItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button type="button" className="primary_button">
              Download Basic Starter
            </button>
          </Card>

          <Card className="download_card">
            <div className="download_card_head">
              <span className="badge_pill">Custom Starter</span>
              <h3>프로젝트 맞춤형 스타터 설정</h3>
              <p>컬러, 헤더, 푸터, 플러그인을 선택하는 UI만 먼저 제공합니다.</p>
            </div>

            <div className="config_stack">
              <div className="config_group">
                <label>Color Palette</label>
                <select defaultValue="default">
                  <option value="default">Default Blue</option>
                  <option value="violet">Violet Studio</option>
                  <option value="mint">Mint Accent</option>
                </select>
              </div>

              <div className="config_group">
                <label>Header Type</label>
                <select defaultValue="corporate">
                  <option value="corporate">Corporate</option>
                  <option value="product">Product</option>
                  <option value="magazine">Magazine</option>
                </select>
              </div>

              <div className="config_group">
                <label>Footer Type</label>
                <select defaultValue="simple">
                  <option value="simple">Simple</option>
                  <option value="columns">Columns</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>

              <div className="config_group">
                <label>Plugins</label>
                <div className="check_grid">
                  {pluginOptions.map((plugin) => (
                    <label key={plugin} className="checkbox_card">
                      <input type="checkbox" defaultChecked={plugin !== 'modal'} />
                      <span>{plugin}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button type="button" className="primary_button">
              Generate Custom Starter
            </button>
          </Card>
        </div>
      </Section>
    </div>
  );
}
