import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/auth-context.jsx'
import PaperBackground from './components/paper-background.jsx'
import SiteHeader from './components/site-header.jsx'
import SiteFooter from './components/site-footer.jsx'
import HomePage from './pages/home-page.jsx'
import AboutPage from './pages/about-page.jsx'
import NotFoundPage from './pages/not-found-page.jsx'

// HashRouter keeps links working on GitHub Pages (no server-side routing there)
function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <a className="skip-link" href="#main" onClick={focusMain}>
          Skip to content
        </a>
        <PaperBackground />
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <SiteFooter />
      </HashRouter>
    </AuthProvider>
  )
}

// With a hash router "#main" would be read as a route, so move focus by hand
function focusMain(event) {
  event.preventDefault()
  document.getElementById('main')?.focus()
}

export default App
