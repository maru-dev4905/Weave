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
    <header className="site_navbar_wrap">
      <div className="site_navbar">
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
      </div>
    </header>
  );
}
