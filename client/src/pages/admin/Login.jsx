import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import Button from '../../components/ui/Button'
import api from '../../services/api'
import { setToken } from '../../utils/auth'

const schema = z.object({
  email: z.email('Ingresa un email válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
})

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } })

  async function submit(values) {
    setError('')
    try {
      const { data } = await api.post('/auth/login', values)
      setToken(data.token)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo iniciar sesión.')
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-deep px-4">
      <form onSubmit={handleSubmit(submit)} className="w-full max-w-md rounded-lg bg-warm p-8 shadow-soft" noValidate>
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-terracotta">Panel privado</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-forest">Administrador</h1>
        <div className="mt-7 grid gap-4">
          <Field label="Email" error={errors.email?.message}><input className="mt-2 h-12 w-full rounded-md border border-gold/30 px-3" type="email" autoComplete="username" {...register('email')} /></Field>
          <Field label="Contraseña" error={errors.password?.message}><input className="mt-2 h-12 w-full rounded-md border border-gold/30 px-3" type="password" autoComplete="current-password" {...register('password')} /></Field>
        </div>
        {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700" role="alert">{error}</p>}
        <Button disabled={isSubmitting} className="mt-6 w-full" type="submit">{isSubmitting ? 'Ingresando...' : 'Entrar'}</Button>
      </form>
    </main>
  )
}

function Field({ label, error, children }) {
  return <label><span className="text-sm font-semibold">{label}</span>{children}{error && <span className="mt-1 block text-xs text-red-700">{error}</span>}</label>
}
