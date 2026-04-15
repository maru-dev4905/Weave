import { NavLink } from 'react-router-dom';

const links = [
  { to: '/docs/css', label: 'Docs(CSS)', icon: '🎨' },
  { to: '/docs/js', label: 'Docs(JS)', icon: '🧩' },
  { to: '/anim', label: 'Anim', icon: '🎞️' },
  { to: '/tools', label: 'Tools', icon: '🛠️' },
  { to: '/playground', label: 'Playground', icon: '🧪' },
  { to: '/validation', label: 'Validation', icon: '✅' },
  { to: '/form', label: 'Form', icon: '📝' },
  { to: '/plate', label: 'Plate', icon: '🎨' },
  { to: '/download', label: 'Download', icon: '📦' },
];

const themeOptions = [
  { id: 'dark-blue', label: 'dark + blue' },
  { id: 'dark-green', label: 'dark + green' },
  { id: 'dark-pink', label: 'dark + pink' },
  { id: 'light-blue', label: 'light + blue' },
  { id: 'light-green', label: 'light + green' },
  { id: 'light-pink', label: 'light + pink' },
];

export function Navbar({
  themeOpen,
  activeTheme,
  sidebarOpen,
  onToggleSidebar,
  onToggleThemePanel,
  onSelectTheme,
}) {
  return (
    <aside className="site_sidebar" id="site-sidebar">
      <button
        type="button"
        className="site_sidebar_toggle"
        onClick={onToggleSidebar}
        aria-expanded={sidebarOpen}
        aria-controls="site-sidebar"
        aria-label={sidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
        title={sidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
      >
        <span
          className={sidebarOpen ? 'site_sidebar_toggle_icon' : 'site_sidebar_toggle_icon is_closed'}
          aria-hidden="true"
        >
          ◀
        </span>
      </button>
      <div className="site_sidebar_inner">
        <NavLink to="/" end className="site_brand">
          <span className="site_brand_mark">W</span>
          <span>
            <strong>WEAVE</strong>
            <small>웹을 짜는 가장 실전적인 방식</small>
          </span>
        </NavLink>

        <nav className="site_nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              title={link.label}
              data-nav-label={link.label}
              aria-label={link.label}
              className={({ isActive }) =>
                isActive ? 'site_nav_link is_active' : 'site_nav_link'
              }
            >
              <span className="site_nav_icon" aria-hidden="true">
                {link.icon}
              </span>
              <span className="site_nav_text">{link.label}</span>
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
