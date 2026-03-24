import { useEffect, useState } from 'react';

import { ColorBlock } from '../components/ColorBlock.jsx';
import { Section } from '../components/Section.jsx';
import { palette_tokens } from '../data/palette_tokens.js';

export function PalettePage() {
  const [palettes, setPalettes] = useState([]);

  useEffect(() => {
    const root_styles = window.getComputedStyle(document.documentElement);

    setPalettes(
      palette_tokens.map((group) => ({
        ...group,
        items: group.tokens.map((token) => [
          token,
          root_styles.getPropertyValue(token).trim(),
        ]),
      })),
    );
  }, []);

  return (
    <div className="page_shell">
      <Section
        eyebrow="Plate"
        title="색상 토큰 아카이브"
        description="`common.scss`의 기본 토큰을 그대로 읽어와 그룹별로 보여줍니다. 각 토큰은 바로 복사할 수 있고, 컬러 블록은 더 촘촘하고 밀도 있게 정리했습니다."
        align="wide"
      >
        <div className="palette_stack">
          {palettes.map((group) => (
            <section key={group.title} className="palette_group">
              <div className="palette_group_head">
                <h3>{group.title}</h3>
              </div>
              <div className="palette_grid">
                {group.items.map(([token, value]) => (
                  <ColorBlock key={token} token={token} value={value} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>
    </div>
  );
}
