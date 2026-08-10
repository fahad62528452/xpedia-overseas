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

  return (
    <header className={`nav${onDark ? ' nav--dark' : ''}`}>
      <a
        className="nav__brand"
        href="#top"
        aria-label="Xpedia Overseas Education home"
        onClick={(e) => {
          e.preventDefault()
          scrollToPage(0)
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
              scrollToPage(link.page)
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a
        className="nav__cta"
        href="#consult"
        onClick={(e) => {
          e.preventDefault()
          scrollToPage(4)
        }}
      >
        Book a session
      </a>
    </header>
  )
}
