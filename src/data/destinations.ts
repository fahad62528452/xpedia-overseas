export type Destination = {
  id: string
  name: string
  country: string
  /** ISO 3166-1 alpha-2 for flag assets (lowercase) */
  flag: string
  lat: number
  lon: number
  focus: string
  /** Flag-inspired accent colors [primary, secondary] */
  colors: [string, string]
}

/** Home origin shown on the hero globe (not a study corridor). */
export const INDIA_ORIGIN = {
  id: 'in',
  name: 'India',
  flag: 'in',
  lat: 20.6,
  lon: 78.9,
  colors: ['#FF9933', '#138808'] as [string, string],
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'uk',
    name: 'United Kingdom',
    country: 'UK',
    flag: 'gb',
    lat: 51.5,
    lon: -0.1,
    focus: 'Russell Group admissions & skilled worker routes',
    colors: ['#012169', '#c8102e'],
  },
  {
    id: 'ca',
    name: 'Canada',
    country: 'CA',
    flag: 'ca',
    lat: 45.4,
    lon: -75.7,
    focus: 'Study permits, PGWP & Express Entry pathways',
    colors: ['#d52b1e', '#ffffff'],
  },
  {
    id: 'au',
    name: 'Australia',
    country: 'AU',
    flag: 'au',
    lat: -33.9,
    lon: 151.2,
    focus: 'Student visas & regional migration programs',
    colors: ['#00008b', '#e4002b'],
  },
  {
    id: 'us',
    name: 'United States',
    country: 'US',
    flag: 'us',
    lat: 38.9,
    lon: -77.0,
    focus: 'F-1 counselling & OPT career planning',
    colors: ['#3c3b6e', '#b22234'],
  },
  {
    id: 'de',
    name: 'Germany',
    country: 'DE',
    flag: 'de',
    lat: 52.5,
    lon: 13.4,
    focus: 'Tuition-free universities & job seeker visas',
    colors: ['#1a1a1a', '#dd0000'],
  },
  {
    id: 'ae',
    name: 'United Arab Emirates',
    country: 'AE',
    flag: 'ae',
    lat: 25.2,
    lon: 55.3,
    focus: 'Golden Visa & global campus placements',
    colors: ['#00732f', '#ff0000'],
  },
]

export function flagTextureUrl(code: string) {
  return `https://flagcdn.com/w80/${code.toLowerCase()}.png`
}

export const SECTION_HASHES = [
  'top',
  'destinations',
  'services',
  'journey',
  'consult',
] as const

export function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return [x, y, z] as [number, number, number]
}

export function destinationOrbitPosition(
  index: number,
  total = DESTINATIONS.length,
  radius = 2.8,
): [number, number, number] {
  const angle = (index / total) * Math.PI * 2
  return [
    Math.cos(angle) * radius,
    Math.sin(angle * 1.5) * 0.55,
    Math.sin(angle) * radius,
  ]
}
