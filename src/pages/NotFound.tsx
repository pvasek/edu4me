import { Link } from 'react-router-dom'
import { Page } from '../ui/anim'
import { MascotSays } from '../ui/Mascot'

export function NotFound() {
  return (
    <Page>
      <MascotSays mood="sad">
        <strong>Tahle stránka se vypařila.</strong> Možná sublimovala. Zkus to od začátku.
      </MascotSays>
      <Link to="/" className="btn btn-primary">
        Domů
      </Link>
    </Page>
  )
}
