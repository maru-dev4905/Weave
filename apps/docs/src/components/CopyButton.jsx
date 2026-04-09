export function CopyButton({
  label = 'Copy',
  message = '복사되었습니다.',
  text,
  target,
  className = '',
}) {
  const nextClassName = ['copy_ghost_button', 'weave_copy', className].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={nextClassName}
      data-text={text}
      data-target={text ? undefined : target}
      data-copy-message={message}
      data-copy-success-label="COPIED"
    >
      {label}
    </button>
  );
}
