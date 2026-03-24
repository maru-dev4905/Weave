export function Card({ children, className = '', as: Tag = 'article', ...props }) {
  return (
    <Tag className={`surface_card ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
