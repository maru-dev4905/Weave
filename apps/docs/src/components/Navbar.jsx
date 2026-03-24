import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/docs/css', label: 'Docs(CSS)' },
  { to: '/docs/js', label: 'Docs(JS)' },
  { to: '/plate', label: 'Plate' },
  { to: '/download', label: 'Download' },
];

export function Navbar() {
  return (
    <aside className="site_sidebar">
      <div className="site_sidebar_inner">
        <NavLink to="/" end className="site_brand">
          <span className="site_brand_mark">W</span>
          <span>
            <strong>Publishing UI Kit</strong>
            <small>CSS and Script Modules</small>
          </span>
        </NavLink>

        <nav className="site_nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive ? 'site_nav_link is_active' : 'site_nav_link'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="site_sidebar_note">
          <strong>Document Layout</strong>
          <p>왼쪽 탐색, 상단 헤더, 오른쪽 콘텐츠 흐름으로 다시 정리한 퍼블리싱 문서 허브입니다.</p>
        </div>
      </div>
    </aside>
  );
}
