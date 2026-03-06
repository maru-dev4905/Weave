export function Card({ children, className = '', as: Tag = 'article' }) {
  return <Tag className={`surface_card ${className}`.trim()}>{children}</Tag>;
}
