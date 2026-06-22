import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Save } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Button from '../../components/ui/Button'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/AsyncState'
import api from '../../services/api'
import { formatCurrency } from '../../utils/format'

const schema = z.object({
  name: z.string().trim().min(2, 'Escribe el nombre.'),
  shortDescription: z.string().trim().max(300),
  description: z.string().trim().min(5, 'Escribe una descripción.'),
  categorySlug: z.string().min(1, 'Selecciona una categoría.'),
  intention: z.string().trim().min(2, 'Escribe la intención.'),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  sku: z.string().trim().max(100),
  mainImage: z.union([z.literal(''), z.url('Usa una URL válida.')]),
  ritualUse: z.string().trim().max(3000),
  ingredients: z.string(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
})

const defaults = { name: '', shortDescription: '', description: '', categorySlug: '', intention: '', price: 0, compareAtPrice: 0, stock: 0, sku: '', mainImage: '', ritualUse: '', ingredients: '', isFeatured: false, isActive: true }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setPageError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: defaults })

  const load = useCallback(async () => {
    setLoading(true)
    setPageError('')
    try {
      const [productRes, categoryRes] = await Promise.all([api.get('/admin/products'), api.get('/categories')])
      setProducts(productRes.data)
      setCategories(categoryRes.data)
    } catch {
      setPageError('No se pudo cargar el inventario.')
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

  function edit(product) {
    setEditingId(product._id)
    reset({ ...defaults, ...product, ingredients: (product.ingredients || []).join(', ') })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function save(values) {
    setPageError('')
    try {
      const payload = { ...values, images: [values.mainImage].filter(Boolean) }
      if (editingId) await api.put(`/admin/products/${editingId}`, payload)
      else await api.post('/admin/products', payload)
      startNew()
      await load()
    } catch (err) {
      setPageError(err.response?.data?.message || 'No se pudo guardar el producto.')
    }
  }

  async function toggle(product) {
    try {
      await api.patch(`/admin/products/${product._id}/status`, { isActive: !product.isActive })
      await load()
    } catch (err) {
      setPageError(err.response?.data?.message || 'No se pudo actualizar el producto.')
    }
  }

  return (
    <section className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <form onSubmit={handleSubmit(save)} className="h-fit rounded-lg border border-gold/20 bg-white p-5 shadow-soft" noValidate>
        <h1 className="font-display text-4xl font-bold text-forest">{editingId ? 'Editar producto' : 'Crear producto'}</h1>
        <div className="mt-5 grid gap-3">
          <Input label="Nombre" error={errors.name?.message} registration={register('name')} />
          <Input label="Descripción corta" error={errors.shortDescription?.message} registration={register('shortDescription')} />
          <FieldError error={errors.description?.message}><textarea className="min-h-24 rounded-md border border-gold/30 p-3" placeholder="Descripción larga" {...register('description')} /></FieldError>
          <FieldError error={errors.categorySlug?.message}><select className="h-11 rounded-md border border-gold/30 px-3" {...register('categorySlug')}><option value="">Categoría</option>{categories.map((category) => <option key={category._id} value={category.slug}>{category.name}</option>)}</select></FieldError>
          <Input label="Intención" error={errors.intention?.message} registration={register('intention')} />
          <div className="grid grid-cols-2 gap-3"><Input label="Precio" type="number" error={errors.price?.message} registration={register('price')} /><Input label="Stock" type="number" error={errors.stock?.message} registration={register('stock')} /></div>
          <Input label="Precio anterior" type="number" error={errors.compareAtPrice?.message} registration={register('compareAtPrice')} />
          <Input label="SKU" error={errors.sku?.message} registration={register('sku')} />
          <Input label="Imagen principal URL" type="url" error={errors.mainImage?.message} registration={register('mainImage')} />
          <Input label="Ingredientes separados por coma" error={errors.ingredients?.message} registration={register('ingredients')} />
          <FieldError error={errors.ritualUse?.message}><textarea className="min-h-20 rounded-md border border-gold/30 p-3" placeholder="Modo de uso ritual" {...register('ritualUse')} /></FieldError>
          <div className="flex gap-5"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" {...register('isFeatured')} /> Destacado</label><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" {...register('isActive')} /> Activo</label></div>
          <Button type="submit" disabled={isSubmitting}><Save size={18} /> {isSubmitting ? 'Guardando...' : 'Guardar producto'}</Button>
        </div>
      </form>

      <div>
        <div className="mb-5 flex items-center justify-between"><h2 className="font-display text-4xl font-bold text-forest">Productos</h2><Button variant="outline" type="button" onClick={startNew}><Plus size={18} /> Nuevo</Button></div>
        {error && <div className="mb-5"><ErrorState message={error} onRetry={load} /></div>}
        {loading ? <LoadingState /> : products.length ? (
          <div className="overflow-hidden rounded-lg border border-gold/20 bg-white shadow-soft">
            {products.map((product) => <article key={product._id} className="grid gap-4 border-b border-gold/10 p-4 md:grid-cols-[72px_1fr_auto] md:items-center"><img className="size-18 rounded-md bg-ritual object-cover" src={product.mainImage} alt="" loading="lazy" /><div><h3 className="font-display text-2xl font-bold text-forest">{product.name}</h3><p className="text-sm text-incense/70">{product.categoryName} · {formatCurrency(product.price)} · Stock {product.stock}</p></div><div className="flex gap-2"><Button variant="outline" type="button" onClick={() => edit(product)}>Editar</Button><Button variant={product.isActive ? 'ghost' : 'secondary'} type="button" onClick={() => toggle(product)}>{product.isActive ? 'Desactivar' : 'Activar'}</Button></div></article>)}
          </div>
        ) : <EmptyState message="No hay productos creados." />}
      </div>
    </section>
  )
}

function Input({ label, type = 'text', registration, error }) {
  return <FieldError error={error}><input className="h-11 rounded-md border border-gold/30 px-3" aria-label={label} placeholder={label} type={type} {...registration} /></FieldError>
}

function FieldError({ error, children }) {
  return <label className="grid gap-1">{children}{error && <span className="text-xs text-red-700">{error}</span>}</label>
}
