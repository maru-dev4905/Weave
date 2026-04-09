import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/docs/css', label: 'Docs(CSS)' },
  { to: '/docs/js', label: 'Docs(JS)' },
  { to: '/anim', label: 'Anim' },
  { to: '/tools', label: 'Tools' },
  { to: '/validation', label: 'Validation' },
  { to: '/form', label: 'Form' },
  { to: '/plate', label: 'Plate' },
  { to: '/download', label: 'Download' },
];

const themeOptions = [
  { id: 'dark-blue', label: 'dark + blue' },
  { id: 'dark-green', label: 'dark + green' },
  { id: 'dark-pink', label: 'dark + pink' },
  { id: 'light-blue', label: 'light + blue' },
  { id: 'light-green', label: 'light + green' },
  { id: 'light-pink', label: 'light + pink' },
];

export function Navbar({ themeOpen, activeTheme, onToggleThemePanel, onSelectTheme }) {
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

        <div className="site_theme_panel">
          <button
            type="button"
            className={themeOpen ? 'site_theme_toggle is_open' : 'site_theme_toggle'}
            onClick={onToggleThemePanel}
            aria-expanded={themeOpen}
            aria-controls="site-theme-options"
          >
            <span className="site_theme_toggle_label">Theme</span>
            <strong className="site_theme_toggle_value">
              <span>{activeTheme.toUpperCase()}</span>
              <span className={`site_theme_swatch is_${activeTheme}`} aria-hidden="true" />
            </strong>
          </button>

          <div
            id="site-theme-options"
            className={themeOpen ? 'site_theme_options is_open' : 'site_theme_options'}
          >
            {themeOptions.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={activeTheme === theme.id ? 'site_theme_option is_active' : 'site_theme_option'}
                onClick={() => onSelectTheme(theme.id)}
              >
                <span className={`site_theme_swatch is_${theme.id}`} aria-hidden="true" />
                <span>{theme.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
