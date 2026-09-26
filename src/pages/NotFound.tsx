import { Link } from 'react-router-dom'
import { MascotSays } from '../ui/Mascot'

export function NotFound() {
  return (
    <main className="page">
      <MascotSays mood="sad">
        <strong>Tahle stránka se vypařila.</strong> Možná sublimovala. Zkus to od začátku.
      </MascotSays>
      <Link to="/" className="btn btn-primary">
        Domů
      </Link>
    </main>
  )
}
