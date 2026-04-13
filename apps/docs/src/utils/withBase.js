/** Vite `import.meta.env.BASE_URL`는 루트여도 끝이 `/`로 끝난다. */
export function withBase(path) {
  const clean = String(path).replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${clean}`;
}
