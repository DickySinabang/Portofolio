export function HeroPlanet({ photo = false }: { photo?: boolean }) {
  return (
    <div aria-hidden="true">
      <div className={`planet-css ${photo ? 'planet-photo' : ''}`} />
    </div>
  )
}
