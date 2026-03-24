export function Sidebar({ title, items }) {
  const handleAnchorClick = (event, href) => {
    if (!href?.startsWith('#')) {
      return;
    }

    const target = document.querySelector(href);

    if (!target) {
      return;
    }

    event.preventDefault();

    const topbarHeight = document.querySelector('.site_topbar')?.offsetHeight ?? 0;
    const nextTop = window.scrollY + target.getBoundingClientRect().top - topbarHeight - 24;

    window.scrollTo({
      top: Math.max(0, nextTop),
      behavior: 'smooth',
    });
  };

  return (
    <aside className="page_sidebar">
      <div className="page_sidebar_card surface_card">
        <p className="page_sidebar_title">{title}</p>
        <nav className="page_sidebar_nav">
          {items.map((item) => (
            <a key={item.href} href={item.href} onClick={(event) => handleAnchorClick(event, item.href)}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
