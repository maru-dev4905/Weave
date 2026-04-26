export function num(value, fallback = 0) {
  const parsed = Number.parseFloat(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeAssetName(name) {
  return String(name || '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function splitBaseAndExt(name) {
  const safeName = String(name || '');
  const index = safeName.lastIndexOf('.');
  if (index <= 0 || index === safeName.length - 1) {
    return [safeName, ''];
  }
  return [safeName.slice(0, index), safeName.slice(index + 1)];
}

export function toFixedSafe(value, decimals) {
  return Number(value).toFixed(Math.max(0, decimals));
}

export function formatNumber(value) {
  if (!Number.isFinite(value)) return '';
  return String(Number.parseFloat(value.toFixed(4)));
}

export function formatBytes(size) {
  if (!Number.isFinite(size)) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let nextSize = size;
  let unitIndex = 0;
  while (nextSize >= 1024 && unitIndex < units.length - 1) {
    nextSize /= 1024;
    unitIndex += 1;
  }
  const fixed = nextSize >= 10 || unitIndex === 0 ? 0 : 1;
  return `${nextSize.toFixed(fixed)} ${units[unitIndex]}`;
}

export function dedupeFileName(fileName, used) {
  if (!used.has(fileName)) {
    used.add(fileName);
    return fileName;
  }

  const [base, ext] = splitBaseAndExt(fileName);
  let index = 2;
  while (true) {
    const candidate = `${base}_dup${index}${ext ? `.${ext}` : ''}`;
    if (!used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
    index += 1;
  }
}
