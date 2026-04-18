import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#0a0a0a', color: '#fff', fontFamily: 'monospace', padding: 32, textAlign: 'center',
        }}>
          <div style={{ maxWidth: 520 }}>
            <div style={{ fontSize: '2rem', marginBottom: 16 }}>⚙️</div>
            <h1 style={{ color: '#f59e0b', marginBottom: 12, fontSize: '1.2rem' }}>Erreur de configuration</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 20, lineHeight: 1.6 }}>
              Les variables d'environnement Supabase sont manquantes ou invalides.
            </p>
            <code style={{
              display: 'block', background: '#1a1a1a', padding: '12px 16px', borderRadius: 8,
              color: '#f59e0b', fontSize: '0.8rem', textAlign: 'left', lineHeight: 2,
            }}>
              VITE_SUPABASE_URL<br />
              VITE_SUPABASE_ANON_KEY
            </code>
            <p style={{ color: 'rgba(255,255,255,0.3)', marginTop: 16, fontSize: '0.85rem' }}>
              Ajoutez ces variables dans Netlify → Site configuration → Environment variables
            </p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
