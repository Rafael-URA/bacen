import { useState } from 'react'
import './App.css'

const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('appAuth') === 'true'
  )
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === APP_PASSWORD) {
      localStorage.setItem('appAuth', 'true')
      setIsAuthenticated(true)
      setPassword('')
    } else {
      alert('Senha incorreta!')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>🔐 Acesso Protegido</h2>
          <p>Guias TISS - Envio de Lote</p>
          <input
            type="password"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      {/* Seu conteúdo original aqui */}
      {/* ... componentes existentes ... */}
      
      {/* Botão para sair (opcional) */}
      <button 
        onClick={() => {
          localStorage.removeItem('appAuth')
          setIsAuthenticated(false)
        }}
        style={{ position: 'absolute', top: 10, right: 10 }}
      >
        🚪 Sair
      </button>
    </div>
  )
}
