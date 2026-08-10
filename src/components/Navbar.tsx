import { useEffect, useState } from 'react'
import './Navbar.css'
import { scrollToPage } from '../experience/scrollToPage'
import { useSiteStore } from '../experience/siteStore'

const links = [
  { href: '#destinations', label: 'Destinations', page: 1 },
  { href: '#services', label: 'Services', page: 2 },
  { href: '#journey', label: 'Journey', page: 3 },
  { href: '#consult', label: 'Consult', page: 4 },
]

export function Navbar() {
  const { sectionIndex } = useSiteStore()
  const onDark = sectionIndex >= 4
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [sectionIndex])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  function go(page: number) {
    setMenuOpen(false)
    scrollToPage(page)
  }

  return (
    <header className={`nav${onDark ? ' nav--dark' : ''}${menuOpen ? ' is-open' : ''}`}>
      <a
        className="nav__brand"
        href="#top"
        aria-label="Xpedia Overseas Education home"
        onClick={(e) => {
          e.preventDefault()
          go(0)
        }}
      >
        <img
          className="nav__logo"
          src="/xpedia-logo.png"
          alt=""
          width={120}
          height={80}
        />
        <span className="nav__text">
          <span className="nav__name">Xpedia</span>
          <span className="nav__tag">Overseas Education</span>
        </span>
      </a>

      <nav className="nav__links" aria-label="Primary">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => {
              e.preventDefault()
              go(link.page)
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="nav__actions">
        <a
          className="nav__cta"
          href="#consult"
          onClick={(e) => {
            e.preventDefault()
            go(4)
          }}
        >
          Book a session
        </a>
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav
        id="mobile-nav"
        className="nav__drawer"
        aria-label="Mobile"
        hidden={!menuOpen}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => {
              e.preventDefault()
              go(link.page)
            }}
          >
            {link.label}
          </a>
        ))}
        <a
          className="nav__drawer-cta"
          href="#consult"
          onClick={(e) => {
            e.preventDefault()
            go(4)
          }}
        >
          Book a session
        </a>
      </nav>
    </header>
  )
}
