import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus, Save } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Button from '../../components/ui/Button'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/AsyncState'
import api from '../../services/api'

const schema = z.object({
  name: z.string().trim().min(2, 'Escribe un nombre.'),
  description: z.string().trim().max(1000),
  image: z.union([z.literal(''), z.url('Usa una URL válida.')]),
  order: z.coerce.number().int().min(0),
  isActive: z.boolean(),
})

const defaults = { name: '', description: '', image: '', order: 0, isActive: true }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setPageError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: defaults })

  const load = useCallback(async () => {
    setLoading(true)
    setPageError('')
    try {
      const { data } = await api.get('/admin/categories')
      setCategories(data)
    } catch {
      setPageError('No se pudieron cargar las categorías.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(load, 0)
    return () => clearTimeout(timer)
  }, [load])

  function startNew() {
    setEditingId(null)
    reset(defaults)
  }

  function edit(category) {
    setEditingId(category._id)
    reset({ name: category.name, description: category.description || '', image: category.image || '', order: category.order || 0, isActive: category.isActive })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function save(values) {
    setPageError('')
    try {
      if (editingId) await api.put(`/admin/categories/${editingId}`, values)
      else await api.post('/admin/categories', values)
      startNew()
      await load()
    } catch (err) {
      setPageError(err.response?.data?.message || 'No se pudo guardar la categoría.')
    }
  }

  async function toggle(category) {
    try {
      await api.put(`/admin/categories/${category._id}`, { ...category, isActive: !category.isActive })
      await load()
    } catch (err) {
      setPageError(err.response?.data?.message || 'No se pudo actualizar la categoría.')
    }
  }

  return (
    <section className="grid gap-8 xl:grid-cols-[390px_1fr]">
      <form onSubmit={handleSubmit(save)} className="h-fit rounded-lg border border-gold/20 bg-white p-5 shadow-soft">
        <h1 className="font-display text-4xl font-bold text-forest">{editingId ? 'Editar categoría' : 'Nueva categoría'}</h1>
        <div className="mt-5 grid gap-4">
          <Field label="Nombre" error={errors.name?.message}><input {...register('name')} /></Field>
          <Field label="Descripción" error={errors.description?.message}><textarea {...register('description')} rows="4" /></Field>
          <Field label="Imagen URL" error={errors.image?.message}><input {...register('image')} type="url" /></Field>
          <Field label="Orden" error={errors.order?.message}><input {...register('order')} type="number" min="0" /></Field>
          <label className="flex items-center gap-2 text-sm font-semibold"><input {...register('isActive')} type="checkbox" /> Categoría activa</label>
          <Button type="submit" disabled={isSubmitting}><Save size={18} /> {isSubmitting ? 'Guardando...' : 'Guardar categoría'}</Button>
        </div>
      </form>

      <div>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-display text-4xl font-bold text-forest">Categorías</h2>
          <Button variant="outline" type="button" onClick={startNew}><Plus size={18} /> Nueva</Button>
        </div>
        {error && <div className="mb-5"><ErrorState message={error} onRetry={load} /></div>}
        {loading ? <LoadingState /> : categories.length ? (
          <div className="overflow-hidden rounded-lg border border-gold/20 bg-white shadow-soft">
            {categories.map((category) => (
              <article key={category._id} className="grid gap-4 border-b border-gold/10 p-4 md:grid-cols-[64px_1fr_auto] md:items-center">
                <img className="size-16 rounded-md bg-ritual object-cover" src={category.image} alt="" loading="lazy" />
                <div><h3 className="font-display text-2xl font-bold text-forest">{category.name}</h3><p className="text-sm text-incense/70">Orden {category.order} · {category.isActive ? 'Activa' : 'Inactiva'}</p></div>
                <div className="flex gap-2"><Button variant="outline" type="button" onClick={() => edit(category)}><Pencil size={16} /> Editar</Button><Button variant="ghost" type="button" onClick={() => toggle(category)}>{category.isActive ? 'Desactivar' : 'Activar'}</Button></div>
              </article>
            ))}
          </div>
        ) : <EmptyState message="No hay categorías creadas." />}
      </div>
    </section>
  )
}

function Field({ label, error, children }) {
  return <label className="grid gap-2 text-sm font-semibold text-forest"><span>{label}</span><span className="[&>input]:h-11 [&>input]:rounded-md [&>input]:border [&>input]:border-gold/30 [&>input]:px-3 [&>textarea]:rounded-md [&>textarea]:border [&>textarea]:border-gold/30 [&>textarea]:p-3">{children}</span>{error && <span className="text-xs text-red-700">{error}</span>}</label>
}
