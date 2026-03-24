export function Card({ children, className = '', as = 'article', ...props }) {
  const Component = as;

  return (
    <Component className={`surface_card ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
