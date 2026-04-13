import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export function Sidebar({ title = '이 페이지에서', items }) {
  const [activeHref, setActiveHref] = useState(items[0]?.href || '');

  useEffect(() => {
    const sectionEntries = items
      .map((item) => ({
        href: item.href,
        element: item.href?.startsWith('#') ? document.querySelector(item.href) : null,
      }))
      .filter((entry) => entry.element);

    if (!sectionEntries.length) {
      return undefined;
    }

    const topbarHeight = document.querySelector('.site_topbar')?.offsetHeight ?? 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (!visibleEntries.length) {
          return;
        }

        const nextVisible = sectionEntries.find((entry) => entry.element === visibleEntries[0].target);

        if (nextVisible?.href) {
          setActiveHref(nextVisible.href);
        }
      },
      {
        rootMargin: `-${topbarHeight + 24}px 0px -55% 0px`,
        threshold: [0.1, 0.25, 0.5],
      },
    );

    sectionEntries.forEach((entry) => {
      observer.observe(entry.element);
    });

    return () => {
      observer.disconnect();
    };
  }, [items]);

  const handleAnchorClick = (event, href) => {
    if (!href?.startsWith('#')) {
      return;
    }

    const target = document.querySelector(href);

    if (!target) {
      return;
    }

    event.preventDefault();
    setActiveHref(href);

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
          {items.map((item) => {
            const depthClass = item.depth ? `is_depth_${item.depth}` : '';

            if (item.href?.startsWith('#')) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(event) => handleAnchorClick(event, item.href)}
                  className={[activeHref === item.href ? 'is_active' : '', depthClass].filter(Boolean).join(' ')}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => [isActive ? 'is_active' : '', depthClass].filter(Boolean).join(' ')}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
