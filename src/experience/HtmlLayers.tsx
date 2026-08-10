import { useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { Scroll } from '@react-three/drei'
import { DESTINATIONS, flagTextureUrl } from '../data/destinations'
import { siteStore, useSiteStore } from './siteStore'
import { scrollToPage } from './scrollToPage'
import { sectionVisibility } from './scrollUtils'

export function HtmlLayers() {
  return (
    <Scroll html style={{ width: '100%' }}>
      <div className="overlay">
        <HeroOverlay />
        <DestinationsOverlay />
        <ServicesOverlay />
        <JourneyOverlay />
        <ConsultOverlay />
        <FooterOverlay />
      </div>
    </Scroll>
  )
}

function SectionPanel({
  index,
  id,
  className = '',
  children,
}: {
  index: number
  id: string
  className?: string
  children: ReactNode
}) {
  const { scrollOffset } = useSiteStore()
  const visibility = sectionVisibility(scrollOffset, index)
  const style: CSSProperties = {
    opacity: 0.12 + visibility * 0.88,
    transform: `translateY(${(1 - visibility) * 18}px)`,
    pointerEvents: visibility > 0.2 ? 'auto' : 'none',
  }

  return (
    <section className={`panel ${className}`.trim()} id={id} style={style}>
      {children}
    </section>
  )
}

function HeroOverlay() {
  const { activeId } = useSiteStore()
  const active =
    DESTINATIONS.find((d) => d.id === activeId) ?? DESTINATIONS[0]

  return (
    <SectionPanel index={0} id="top" className="panel--hero">
      <div className="panel__inner panel__inner--left">
        <p className="panel__brand">Xpedia</p>
        <p className="panel__brand-tag">Overseas Education</p>
        <h1>
          Your world,
          <em> within reach</em>
        </h1>
        <p className="panel__lede">
          Click a country on the globe to focus it — then scroll to explore
          destinations, services, and book a session with Xpedia.
        </p>
        <div className="panel__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => scrollToPage(4)}
          >
            Start your profile
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => scrollToPage(1)}
          >
            Explore destinations
          </button>
        </div>
        <p className="panel__active">
          <img
            className="panel__flag"
            src={flagTextureUrl(active.flag)}
            alt=""
            width={24}
            height={16}
          />
          <span className="panel__active-name">{active.name}</span>
          <span className="panel__active-focus">{active.focus}</span>
        </p>
      </div>
      <p className="scroll-hint" aria-hidden>
        Scroll or use ↑ ↓
      </p>
    </SectionPanel>
  )
}

function DestinationsOverlay() {
  const { activeId } = useSiteStore()

  return (
    <SectionPanel index={1} id="destinations">
      <div className="panel__inner panel__inner--right panel__glass">
        <p className="eyebrow">Where we take you</p>
        <h2>Six cities. Six futures.</h2>
        <p className="panel__lede">
          The globe slides left with you — pick a corridor from the list, or
          click a flag on the globe to focus it.
        </p>
        <div className="dest-list" role="list">
          {DESTINATIONS.map((d) => (
            <button
              key={d.id}
              type="button"
              role="listitem"
              className={`dest-list__item${activeId === d.id ? ' is-active' : ''}`}
              onClick={() => siteStore.setActiveId(d.id)}
            >
              <img
                className="dest-list__flag"
                src={flagTextureUrl(d.flag)}
                alt=""
                width={24}
                height={16}
                aria-hidden
              />
              <strong>{d.name}</strong>
              <em>{d.focus}</em>
            </button>
          ))}
        </div>
      </div>
    </SectionPanel>
  )
}

function ServicesOverlay() {
  return (
    <SectionPanel index={2} id="services">
      <div className="panel__inner panel__inner--right panel__glass">
        <p className="eyebrow">What we do</p>
        <h2>Counsel that travels with you.</h2>
        <p className="panel__lede">
          Four practices as real-world objects — admissions, visas, relocation,
          and careers — one continuous arc of care.
        </p>
        <ul className="plain-list">
          <li>University admissions & scholarship strategy</li>
          <li>Visa dossiers & interview rehearsal</li>
          <li>Housing, banking & arrival logistics</li>
          <li>Post-study work & PR pathway mapping</li>
        </ul>
      </div>
    </SectionPanel>
  )
}

function JourneyOverlay() {
  return (
    <SectionPanel index={3} id="journey">
      <div className="panel__inner panel__inner--left panel__glass">
        <p className="eyebrow">How it feels</p>
        <h2>A clear path abroad.</h2>
        <p className="panel__lede">
          Follow the ribbon: profile, corridor design, application sprint, then
          departure — with a counsellor riding every mile.
        </p>
        <ol className="step-list">
          <li>
            <strong>Profile & intent</strong>
            <span>45-minute discovery of academics, finances, and life goals.</span>
          </li>
          <li>
            <strong>Corridor design</strong>
            <span>Two to three country pathways with real costs and odds.</span>
          </li>
          <li>
            <strong>Application sprint</strong>
            <span>Parallel filing with weekly checkpoints you can see.</span>
          </li>
          <li>
            <strong>Departure & beyond</strong>
            <span>Pre-departure brief and ninety days of named support.</span>
          </li>
        </ol>
      </div>
    </SectionPanel>
  )
}

function ConsultOverlay() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const goal = String(data.get('goal') ?? '').trim()
    const destination = String(data.get('destination') ?? '')

    if (name.length < 2) {
      setError('Please enter your full name.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (goal.length < 12) {
      setError('Tell us a little more about your goal (at least a sentence).')
      return
    }

    const subject = encodeURIComponent(`Consultation request — ${destination}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nDestination: ${destination}\n\nGoal:\n${goal}`,
    )
    window.location.href = `mailto:hello@xpedia.education?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <SectionPanel index={4} id="consult" className="panel--consult">
      <div className="panel__inner panel__glass panel__glass--dark">
        <p className="eyebrow">Begin</p>
        <h2>Book a clarity session.</h2>
        <p className="panel__lede">
          Sit with a counsellor. We respond within one business day with a
          personal match.
        </p>

        {sent ? (
          <p className="thanks">
            Thank you — an Xpedia counsellor will reach out shortly.
          </p>
        ) : (
          <form className="consult-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input name="name" type="text" required autoComplete="name" />
            </label>
            <label>
              Email
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              Preferred destination
              <select name="destination" defaultValue="Canada">
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>United States</option>
                <option>Germany</option>
                <option>United Arab Emirates</option>
                <option>Still exploring</option>
              </select>
            </label>
            <label className="consult-form__full">
              What are you hoping to achieve?
              <textarea
                name="goal"
                rows={3}
                required
                minLength={12}
                placeholder="Study in Canada for a master's, then explore PR options…"
              />
            </label>
            {error ? <p className="consult-error">{error}</p> : null}
            <button className="btn btn--primary" type="submit">
              Request consultation
            </button>
          </form>
        )}
      </div>
    </SectionPanel>
  )
}

function FooterOverlay() {
  return (
    <footer className="panel panel--footer">
      <div className="footer-row">
        <div className="footer-brand">
          <img src="/xpedia-logo.png" alt="" width={36} height={36} />
          <div>
            <p className="panel__brand panel__brand--sm">Xpedia</p>
            <p>Overseas Education</p>
          </div>
        </div>
        <div className="footer-meta">
          <a href="mailto:hello@xpedia.education">hello@xpedia.education</a>
          <p>© {new Date().getFullYear()} Xpedia Overseas Education</p>
        </div>
      </div>
    </footer>
  )
}
