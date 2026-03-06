export function Sidebar({ title, items }) {
  return (
    <aside className="page_sidebar">
      <div className="page_sidebar_card surface_card">
        <p className="page_sidebar_title">{title}</p>
        <nav className="page_sidebar_nav">
          {items.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
