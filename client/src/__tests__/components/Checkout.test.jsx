import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { act } from '@testing-library/react'
import { useCartStore } from '../../store/cartStore'
import Checkout from '../../pages/public/Checkout'

vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const cartItem = {
  _id: 'prod-1',
  slug: 'kit-abundancia',
  name: 'Kit de Abundancia Dorada',
  price: 89000,
  image: '',
  stock: 10,
  quantity: 1,
}

function renderCheckout() {
  return render(
    <MemoryRouter>
      <Checkout />
    </MemoryRouter>
  )
}

describe('Checkout', () => {
  beforeEach(() => {
    act(() => useCartStore.setState({ items: [cartItem] }))
    mockNavigate.mockReset()
  })

  it('shows the checkout form when cart has items', () => {
    renderCheckout()
    expect(screen.getByRole('heading', { name: /checkout/i })).toBeInTheDocument()
  })

  it('shows a redirect message when cart is empty', () => {
    act(() => useCartStore.setState({ items: [] }))
    renderCheckout()
    expect(screen.getByText(/no hay productos/i)).toBeInTheDocument()
  })

  it('shows cart item in order summary', () => {
    renderCheckout()
    expect(screen.getByText(/Kit de Abundancia Dorada/i)).toBeInTheDocument()
  })

  it('shows validation errors for empty required fields', async () => {
    renderCheckout()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /finalizar/i }))

    // Zod schema: fullName min 2 chars → 'Escribe tu nombre completo.'
    await waitFor(() => {
      expect(screen.getByText(/escribe tu nombre completo/i)).toBeInTheDocument()
    })
  })

  it('submits form and navigates on success', async () => {
    const api = (await import('../../services/api')).default
    api.post.mockResolvedValue({
      data: {
        order: { orderNumber: 'BEI-20260620-ABC12', customer: { fullName: 'Ana García' }, total: 89000, items: [] },
        whatsappMessage: 'Hola...',
      },
    })

    renderCheckout()
    const user = userEvent.setup()

    await user.type(screen.getByRole('textbox', { name: /nombre/i }), 'Ana García')
    await user.type(screen.getByRole('textbox', { name: /whatsapp/i }), '3001234567')
    await user.type(screen.getByRole('textbox', { name: /ciudad/i }), 'Bogotá')
    await user.type(screen.getByRole('textbox', { name: /direcci/i }), 'Calle 100 # 15-20 Apto 301')

    await user.click(screen.getByRole('button', { name: /finalizar/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/confirmacion', expect.anything())
    })
  })

  it('shows API error message on failed submission', async () => {
    const api = (await import('../../services/api')).default
    api.post.mockRejectedValue({
      response: { data: { message: 'Stock insuficiente para Kit de Abundancia Dorada.' } },
    })

    renderCheckout()
    const user = userEvent.setup()

    await user.type(screen.getByRole('textbox', { name: /nombre/i }), 'Ana García')
    await user.type(screen.getByRole('textbox', { name: /whatsapp/i }), '3001234567')
    await user.type(screen.getByRole('textbox', { name: /ciudad/i }), 'Bogotá')
    await user.type(screen.getByRole('textbox', { name: /direcci/i }), 'Calle 100 # 15-20 Apto 301')

    await user.click(screen.getByRole('button', { name: /finalizar/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Stock insuficiente/i)
    })
  })
})
