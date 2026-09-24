import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="container lost">
      <p className="lost__code">404</p>
      <p className="hand" style={{ fontSize: '2rem' }}>This page was torn out of the notebook.</p>
      <Link to="/" className="btn">
        Back to the notebook
      </Link>
    </div>
  )
}

export default NotFoundPage
