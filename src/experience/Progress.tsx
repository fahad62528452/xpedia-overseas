import { SECTION_LABELS } from './rooms'
import { siteStore, useSiteStore } from './siteStore'
import './Progress.css'

export function Progress() {
  const { sectionIndex, ready } = useSiteStore()

  if (!ready) return null

  return (
    <nav className="progress" aria-label="Section progress">
      {SECTION_LABELS.map((label, index) => (
        <button
          key={label}
          type="button"
          className={`progress__dot${sectionIndex === index ? ' is-active' : ''}`}
          aria-label={label}
          aria-current={sectionIndex === index ? 'true' : undefined}
          onClick={() => siteStore.scrollToPage(index)}
        >
          <span className="progress__label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
