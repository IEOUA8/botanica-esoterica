import { Plus, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from '../../components/ui/Button'
import api from '../../services/api'
import { formatCurrency } from '../../utils/format'

const emptyProduct = {
  name: '',
  shortDescription: '',
  description: '',
  categorySlug: '',
  intention: '',
  price: '',
  compareAtPrice: '',
  stock: '',
  sku: '',
  mainImage: '',
  ritualUse: '',
  ingredients: '',
  isFeatured: false,
  isActive: true,
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyProduct)

  function load() {
    Promise.all([api.get('/admin/products'), api.get('/categories')]).then(([productsRes, categoriesRes]) => {
      setProducts(productsRes.data)
      setCategories(categoriesRes.data)
    })
  }

  useEffect(load, [])

  function edit(product) {
    setForm({
      ...emptyProduct,
      ...product,
      ingredients: (product.ingredients || []).join(', '),
    })
  }

  async function save(event) {
    event.preventDefault()
    const payload = { ...form, images: [form.mainImage].filter(Boolean) }
    if (form._id) await api.put(`/admin/products/${form._id}`, payload)
    else await api.post('/admin/products', payload)
    setForm(emptyProduct)
    load()
  }

  async function toggle(product) {
    await api.patch(`/admin/products/${product._id}/status`, { isActive: !product.isActive })
    load()
  }

  return (
    <section className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <form onSubmit={save} className="h-fit rounded-lg border border-gold/20 bg-white p-5 shadow-soft">
        <h1 className="font-display text-4xl font-bold text-forest">{form._id ? 'Editar producto' : 'Crear producto'}</h1>
        <div className="mt-5 grid gap-3">
          <Input label="Nombre" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
          <Input label="Descripción corta" value={form.shortDescription} onChange={(value) => setForm({ ...form, shortDescription: value })} />
          <textarea className="min-h-24 rounded-md border border-gold/30 p-3" placeholder="Descripción larga" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
          <select className="h-11 rounded-md border border-gold/30 px-3" value={form.categorySlug} onChange={(event) => setForm({ ...form, categorySlug: event.target.value })} required>
            <option value="">Categoría</option>
            {categories.map((category) => <option key={category._id} value={category.slug}>{category.name}</option>)}
          </select>
          <Input label="Intención" value={form.intention} onChange={(value) => setForm({ ...form, intention: value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Precio" type="number" value={form.price} onChange={(value) => setForm({ ...form, price: value })} required />
            <Input label="Stock" type="number" value={form.stock} onChange={(value) => setForm({ ...form, stock: value })} required />
          </div>
          <Input label="Imagen principal URL" value={form.mainImage} onChange={(value) => setForm({ ...form, mainImage: value })} />
          <Input label="Ingredientes" value={form.ingredients} onChange={(value) => setForm({ ...form, ingredients: value })} />
          <textarea className="min-h-20 rounded-md border border-gold/30 p-3" placeholder="Modo de uso ritual" value={form.ritualUse} onChange={(event) => setForm({ ...form, ritualUse: event.target.value })} />
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })} /> Destacado</label>
          <Button type="submit"><Save size={18} /> Guardar producto</Button>
        </div>
      </form>

      <div>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-4xl font-bold text-forest">Productos</h2>
          <Button variant="outline" onClick={() => setForm(emptyProduct)}><Plus size={18} /> Nuevo</Button>
        </div>
        <div className="overflow-hidden rounded-lg border border-gold/20 bg-white shadow-soft">
          {products.map((product) => (
            <article key={product._id} className="grid gap-4 border-b border-gold/10 p-4 md:grid-cols-[72px_1fr_auto] md:items-center">
              <img className="size-18 rounded-md object-cover" src={product.mainImage} alt={product.name} />
              <div>
                <h3 className="font-display text-2xl font-bold text-forest">{product.name}</h3>
                <p className="text-sm text-incense/70">{product.categoryName} · {formatCurrency(product.price)} · Stock {product.stock}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => edit(product)}>Editar</Button>
                <Button variant={product.isActive ? 'ghost' : 'secondary'} onClick={() => toggle(product)}>{product.isActive ? 'Desactivar' : 'Activar'}</Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Input({ label, type = 'text', value, onChange, required }) {
  return <input className="h-11 rounded-md border border-gold/30 px-3" placeholder={label} type={type} value={value ?? ''} onChange={(event) => onChange(event.target.value)} required={required} />
}
