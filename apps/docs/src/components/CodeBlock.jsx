import { useId } from 'react';

import { CopyButton } from './CopyButton.jsx';

export function CodeBlock({
  code,
  language = 'html',
  copyLabel = 'Copy',
  message = '코드를 복사했습니다.',
}) {
  const id = useId().replace(/:/g, '');
  const targetId = `code-block-${id}`;

  return (
    <div className="code_block surface_card">
      <div className="code_block_head">
        <span>{language}</span>
        <CopyButton label={copyLabel} target={`#${targetId}`} message={message} />
      </div>
      <pre>
        <code id={targetId}>{code}</code>
      </pre>
    </div>
  );
}
