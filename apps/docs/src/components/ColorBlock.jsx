export function ColorBlock({ token, value }) {
  return (
    <div className="color_block surface_card">
      <div className="color_block_swatch" style={{ background: value }} />
      <div className="color_block_meta">
        <div>
          <strong>{token}</strong>
          <span>{value}</span>
        </div>
        <button
          type="button"
          className="copy_ghost_button"
          data-weave-copy
          data-text={token}
          data-copy-message={`${token} 토큰을 복사했습니다.`}
          data-copy-success-label="COPIED"
        >
          Copy
        </button>
      </div>
    </div>
  );
}
