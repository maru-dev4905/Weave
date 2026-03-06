import { useId } from 'react';

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
        <button
          type="button"
          className="copy_ghost_button weave_copy"
          data-target={`#${targetId}`}
          data-copy-message={message}
          data-copy-success-label="COPIED"
        >
          {copyLabel}
        </button>
      </div>
      <pre>
        <code id={targetId}>{code}</code>
      </pre>
    </div>
  );
}
