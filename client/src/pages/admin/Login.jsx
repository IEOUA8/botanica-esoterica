import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import api from '../../services/api'
import { setToken } from '../../utils/auth'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      setToken(data.token)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo iniciar sesión.')
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-deep px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg bg-warm p-8 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-terracotta">Panel privado</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-forest">Administrador</h1>
        <div className="mt-7 grid gap-4">
          <label>
            <span className="text-sm font-semibold">Email</span>
            <input className="mt-2 h-12 w-full rounded-md border border-gold/30 px-3" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
          <label>
            <span className="text-sm font-semibold">Contraseña</span>
            <input className="mt-2 h-12 w-full rounded-md border border-gold/30 px-3" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </label>
        </div>
        {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <Button className="mt-6 w-full" type="submit">Entrar</Button>
      </form>
    </main>
  )
}
