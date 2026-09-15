import { useMemo, useState } from 'react'
import { Compass, LocateFixed, MapPin, Navigation, RotateCcw } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Callout } from '../components/ui/Callout'
import { Card, StatCard } from '../components/ui/Card'
import { ResultBanner } from '../components/ui/ResultBanner'
import { SectionHeader } from '../components/ui/SectionHeader'
import { formatNumber } from '../utils/format'

function circularDifference(a, b) {
  return Math.abs(((a - b + 540) % 360) - 180)
}

function cardinalDirection(deg) {
  if (deg == null) return 'Waiting'
  const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West']
  return directions[Math.round(deg / 45) % 8]
}

function getIdealDirection(latitude) {
  if (latitude == null) return { degrees: 180, label: 'South', reason: 'Most sites north of the equator should face panels south.' }
  if (Math.abs(latitude) <= 5) return { degrees: 180, label: 'South or North', reason: 'Near the equator, both directions can work. Avoid shade and confirm local site conditions.' }
  return latitude > 0
    ? { degrees: 180, label: 'South', reason: 'This location is north of the equator, so panels should generally face south.' }
    : { degrees: 0, label: 'North', reason: 'This location is south of the equator, so panels should generally face north.' }
}

export function SolarNavigatorPage() {
  const [coords, setCoords] = useState(null)
  const [heading, setHeading] = useState(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const ideal = useMemo(() => getIdealDirection(coords?.latitude), [coords])
  const diff = heading == null ? null : circularDifference(heading, ideal.degrees)
  const placement = useMemo(() => {
    if (diff == null) return { label: 'Start Compass', tone: 'blue', message: 'Face your phone toward the roof direction where the panels would face.' }
    if (diff <= 30) return { label: 'Recommended', tone: 'green', message: 'This facing direction is close to the ideal panel direction.' }
    if (diff <= 60) return { label: 'Acceptable', tone: 'gold', message: 'This can work, but confirm shading and expected production before final design.' }
    return { label: 'Needs Review', tone: 'orange', message: 'This direction is far from the ideal panel direction. Consider another roof face if possible.' }
  }, [diff])

  function locateSite() {
    setError('')
    if (!navigator.geolocation) {
      setError('Location is not available on this device or browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
        setStatus('Location captured.')
      },
      () => setError('Location permission was not granted. Enable location access and try again.'),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    )
  }

  async function startCompass() {
    setError('')
    const OrientationEvent = window.DeviceOrientationEvent
    if (!OrientationEvent) {
      setError('Compass is not available in this browser. Try the installed mobile app or a mobile browser with motion sensors enabled.')
      return
    }
    if (typeof OrientationEvent.requestPermission === 'function') {
      const permission = await OrientationEvent.requestPermission()
      if (permission !== 'granted') {
        setError('Motion permission was not granted. Allow motion access to use the compass.')
        return
      }
    }

    const handleOrientation = (event) => {
      const rawHeading = event.webkitCompassHeading ?? (typeof event.alpha === 'number' ? (360 - event.alpha) % 360 : null)
      if (rawHeading != null) {
        setHeading(Math.round(rawHeading))
        setStatus('Compass is active.')
      }
    }

    window.addEventListener('deviceorientationabsolute', handleOrientation, true)
    window.addEventListener('deviceorientation', handleOrientation, true)
  }

  const mapsUrl = coords ? `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}` : ''
  const embedUrl = coords && googleMapsKey
    ? `https://www.google.com/maps/embed/v1/view?key=${googleMapsKey}&center=${coords.latitude},${coords.longitude}&zoom=18&maptype=roadmap`
    : ''

  return (
    <div>
      <SectionHeader title="Solar Navigator" subtitle="Use phone location and compass direction to check whether a panel-facing direction is suitable." />
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Compass Check</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Stand at the site and point your phone toward the roof face.</p>
            </div>
          </div>

          <div className="my-6 flex justify-center">
            <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-white/80 bg-white/75 shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="absolute top-4 text-xs font-bold text-slate-400">N</div>
              <div className="absolute bottom-4 text-xs font-bold text-slate-400">S</div>
              <div className="absolute left-5 text-xs font-bold text-slate-400">W</div>
              <div className="absolute right-5 text-xs font-bold text-slate-400">E</div>
              <div className="absolute h-44 w-1 rounded-full bg-sky-200/70" style={{ transform: `rotate(${ideal.degrees}deg)` }} />
              <Navigation className="relative h-16 w-16 text-sky-600 drop-shadow" style={{ transform: `rotate(${heading ?? 0}deg)` }} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="primary" onClick={startCompass}><Compass className="h-4 w-4" />Start Compass</Button>
            <Button variant="soft" onClick={locateSite}><LocateFixed className="h-4 w-4" />Use Location</Button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StatCard label="Phone Facing" value={heading == null ? 'Waiting' : `${heading}deg`} unit={cardinalDirection(heading)} tone="blue" />
            <StatCard label="Best Facing" value={ideal.label} unit={ideal.degrees === 180 ? '180deg' : ideal.degrees === 0 ? '0deg' : ''} tone="green" />
          </div>
          {diff != null ? <Callout tone={placement.tone}>{placement.message} Difference from ideal: {formatNumber(diff)}deg.</Callout> : null}
          {error ? <Callout tone="warning">{error}</Callout> : null}
          {status ? <p className="mt-3 text-xs font-semibold text-sky-700 dark:text-sky-300">{status}</p> : null}
        </Card>

        <div className="space-y-4">
          <ResultBanner label="Placement Status" value={placement.label} sub={ideal.reason} />
          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/10">
              <div className="flex items-center gap-2 font-heading font-bold text-slate-950 dark:text-white">
                <MapPin className="h-5 w-5 text-sky-600" />
                Site Map
              </div>
              {coords ? <a className="text-xs font-bold text-sky-600 dark:text-sky-300" href={mapsUrl} target="_blank" rel="noreferrer">Open Google Maps</a> : null}
            </div>
            {embedUrl ? (
              <iframe title="Site map" className="h-72 w-full border-0" src={embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className="flex h-72 flex-col items-center justify-center gap-3 bg-sky-50/60 p-6 text-center dark:bg-white/5">
                <MapPin className="h-8 w-8 text-sky-500" />
                <div className="max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {coords ? `Location captured: ${formatNumber(coords.latitude, 5)}, ${formatNumber(coords.longitude, 5)}. Add a Google Maps key as VITE_GOOGLE_MAPS_API_KEY to show the live map here.` : 'Tap Use Location to capture the site coordinates. A normal Google map will display here once the API key is added.'}
                </div>
              </div>
            )}
          </Card>
          <Button variant="soft" onClick={() => { setCoords(null); setHeading(null); setStatus(''); setError('') }}>
            <RotateCcw className="h-4 w-4" />
            Reset Check
          </Button>
        </div>
      </div>
    </div>
  )
}
