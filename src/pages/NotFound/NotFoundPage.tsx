import { useNavigate } from 'react-router-dom'
import './NotFoundPage.css'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main className="not-found">
      <span className="not-found__code">404</span>
      <h1 className="not-found__title">Página no encontrada</h1>
      <p className="not-found__description">
        La página que buscas no existe o fue movida.
      </p>
      <button
        className="not-found__link"
        onClick={() => navigate('/', { replace: true })}
      >
        Volver al inicio
      </button>
    </main>
  )
}
