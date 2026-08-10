import { useSiteStore } from './siteStore'
import './Loader.css'

export function Loader() {
  const { ready } = useSiteStore()

  return (
    <div
      className={`loader${ready ? ' is-done' : ''}`}
      aria-hidden={ready}
      aria-busy={!ready}
    >
      <img
        className="loader__logo"
        src="/xpedia-logo.png"
        alt="Xpedia"
        width={160}
        height={110}
      />
      <p className="loader__text">Opening your pathway</p>
    </div>
  )
}
