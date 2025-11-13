import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import type { CartItem, Product } from '../../../shared/types'
import { ProductGrid } from '../components/ProductGrid'
import { CartPanel, type PosCartAction } from '../components/CartPanel'
import { CheckoutModal } from '../components/CheckoutModal'
import { mockProducts } from '../data/mock'
import { Button } from '../../../shared/components/ui/Button'
import { CashControlModal } from '../components/CashControlModal'
import { CloseSessionModal } from '../components/CloseSessionModal'
import { RestaurantLogin } from '../components/RestaurantLogin'
import { RestaurantFloorView } from '../components/RestaurantFloorView'
import { CartActionModal, type CartActionModalState } from '../components/CartActionModal'
import { usePosSession } from '../state/PosSessionProvider'
import '../pos.css'
import '../restaurant.css'

type RestaurantStage = 'login' | 'floor' | 'ordering'

export function PosPage (): JSX.Element {
  const { storeId } = useParams<{ storeId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    getStore,
    openSession,
    saveSessionState,
    closeSession,
    updateTableStatus,
    updateTableConfig,
    updateTableColors,
    updateKitchenStage,
    toggleKitchenServed
  } = usePosSession()

  const store = getStore(storeId)

  useEffect(() => {
    if (store == null) {
      navigate('/pos', { replace: true })
    }
  }, [store, navigate])

  const initialSessionType =
    (location.state?.sessionType as 'resume' | 'new' | undefined) ??
    (store?.status === 'active' ? 'resume' : 'new')

  const [products] = useState<Product[]>(mockProducts)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả')
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentValue, setPaymentValue] = useState<string>('')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [cashModalOpen, setCashModalOpen] = useState(false)
  const [openingCash, setOpeningCash] = useState<string>('0')
  const [openingNote, setOpeningNote] = useState<string>('')
  const [cashError, setCashError] = useState<string | null>(null)
  const [sessionType] = useState<'resume' | 'new'>(initialSessionType ?? 'new')
  const [closeModalOpen, setCloseModalOpen] = useState(false)
  const [closingCash, setClosingCash] = useState('')
  const [closingNote, setClosingNote] = useState('')
  const [orderNote, setOrderNote] = useState<string>('')
  const [actionModal, setActionModal] = useState<CartActionModalState>({ type: 'none' })
  const [restaurantStage, setRestaurantStage] = useState<RestaurantStage>(
    store?.isRestaurant === true ? 'login' : 'ordering'
  )
  const [activeTableId, setActiveTableId] = useState<string | null>(null)
  const hasInitialised = useRef(false)

  useEffect(() => {
    if (!hasInitialised.current && store != null) {
      setCart(store.cachedCart ?? [])
      setPaymentValue(store.cachedPayment ?? '')
      setOpeningCash(store.openingCash != null ? String(store.openingCash) : '0')
      hasInitialised.current = true
      if (store.isRestaurant === true) {
        setRestaurantStage('login')
      }
      if (store.isRestaurant !== true && sessionType === 'new') {
        setCashModalOpen(true)
      }
    }
  }, [store, sessionType])

  useEffect(() => {
    if (storeId != null) {
      setOpeningCash('0')
      setOpeningNote('')
      setCashError(null)
      setClosingCash('')
      setClosingNote('')
      setCloseModalOpen(false)
      hasInitialised.current = false
    }
  }, [storeId])

  const categories = useMemo(
    () => ['Tất cả', ...new Set(products.map(product => product.category))],
    [products]
  )

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const keyword = search.toLowerCase()
      const matchSearch =
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword)
      const matchCategory =
        selectedCategory === 'Tất cả' || product.category === selectedCategory
      return matchSearch && matchCategory
    })
  }, [products, search, selectedCategory])

  const handleAddToCart = (product: Product): void => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id)
      if (existing != null) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        )
      }
      return [...prev, { productId: product.id, quantity: 1 }]
    })
  }

  const handleIncrease = (productId: string): void => {
    setCart(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const handleDecrease = (productId: string): void => {
    setCart(prev =>
      prev
        .map(item =>
          item.productId === productId
            ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const handleRemove = (productId: string): void => {
    setCart(prev => prev.filter(item => item.productId !== productId))
  }

  const totalAmount = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId)
        return sum + (product?.price ?? 0) * item.quantity
      }, 0),
    [cart, products]
  )

  const orderMetrics = useMemo(
    () => ({
      lines: cart.length,
      items: cart.reduce((sum, item) => sum + item.quantity, 0),
      amount: totalAmount
    }),
    [cart, totalAmount]
  )

  const handlePaymentInput = (value: string): void => {
    setPaymentValue(prev => {
      const next = value === '000' ? prev + '000' : prev + value
      if (next.length > 9) return prev
      return next.replace(/^0+/, '').replace(/\D/g, '') || ''
    })
  }

  const handlePaymentClear = (): void => {
    setPaymentValue(prev => prev.slice(0, -1))
  }

  const handleConfirmCash = (): void => {
    const sanitized = openingCash.trim()
    const parsedCash =
      sanitized.length === 0 ? 0 : Number(Number.parseFloat(sanitized).toFixed(0))

    if (Number.isNaN(parsedCash) || parsedCash < 0) {
      setCashError('Vui lòng nhập số tiền mặt hợp lệ.')
      return
    }

    if (storeId != null) {
      openSession(storeId, {
        openingCash: parsedCash,
        note: openingNote.trim()
      })
    }
    setOpeningCash(String(parsedCash))
    setCashError(null)
    setCashModalOpen(false)
    if (store?.isRestaurant === true) {
      setRestaurantStage('floor')
    }
  }

  const handleCancelCash = (): void => {
    setCashError(null)
    setOpeningCash('0')
    if (store?.isRestaurant === true) {
      setRestaurantStage('login')
    } else {
      navigate('/pos', { replace: true })
    }
  }

  const handleCloseSession = (): void => {
    if (storeId == null) return

    const counted = Number(closingCash || 0)

    closeSession(storeId, {
      countedCash: counted,
      note: closingNote.trim()
    })
    setCart([])
    setPaymentValue('')
    setOrderNote('')
    setCloseModalOpen(false)
    setRestaurantStage(store?.isRestaurant ? 'floor' : 'ordering')
    navigate('/pos', { replace: true })
  }

  const handleKeepSession = (): void => {
    if (storeId == null) return
    saveSessionState(storeId, {
      cart,
      paymentValue
    })
    setCloseModalOpen(false)
    if (store?.isRestaurant === true) {
      setRestaurantStage('floor')
    } else {
      navigate('/pos', { replace: true })
    }
  }

  const handleContinueSelling = (): void => {
    setCloseModalOpen(false)
  }

  const openMessageModal = (title: string, description: string): void => {
    setActionModal({
      type: 'message',
      title,
      description
    })
  }

  const handleCartAction = (action: PosCartAction): void => {
    switch (action) {
      case 'hold':
        if (storeId != null) {
          saveSessionState(storeId, { cart, paymentValue })
          if (store?.isRestaurant === true) {
            setRestaurantStage('floor')
            setActiveTableId(null)
          }
          openMessageModal(
            'Đã lưu tạm đơn hàng',
            'Đơn hàng sẽ xuất hiện trong trạng thái Tiếp tục phiên để bạn quay lại xử lý.'
          )
        } else {
          openMessageModal(
            'Không thể lưu đơn',
            'Không xác định được cửa hàng hiện tại, vui lòng thử lại.'
          )
        }
        break
      case 'split':
        openMessageModal(
          'Tách hóa đơn',
          'Tính năng tách hóa đơn đang được mô phỏng. Vui lòng tích hợp nghiệp vụ thực tế khi kết nối backend.'
        )
        break
      case 'refund':
        openMessageModal(
          'Hoàn tiền',
          'Mở quy trình hoàn tiền cho đơn hàng. Hãy tích hợp API thanh toán khi sẵn sàng.'
        )
        break
      case 'info':
        setActionModal({
          type: 'info',
          totals: orderMetrics
        })
        break
      case 'unit':
        openMessageModal(
          'Đơn vị tính',
          'Chức năng đổi đơn vị tính sẽ được triển khai tùy theo danh mục sản phẩm.'
        )
        break
      case 'price-list':
        openMessageModal(
          'Bảng giá',
          'Chọn bảng giá khác để áp dụng giá và khuyến mãi phù hợp.'
        )
        break
      case 'scan':
        setActionModal({ type: 'scan', code: '' })
        break
      case 'reset-promo':
        openMessageModal(
          'Đặt lại khuyến mãi',
          'Đã đặt lại tất cả chương trình khuyến mãi áp dụng cho giỏ hàng.'
        )
        break
      case 'note':
        setActionModal({ type: 'note', noteDraft: orderNote })
        break
      case 'reward':
        openMessageModal(
          'Điểm thưởng',
          'Áp dụng điểm thưởng/ưu đãi cho khách hàng thân thiết sẽ được tích hợp trong giai đoạn sau.'
        )
        break
      default:
        break
    }
  }

  const handleRestaurantLogin = (): void => {
    if (store?.isRestaurant === true) {
      if (sessionType === 'new') {
        setCashModalOpen(true)
      } else {
        setRestaurantStage('floor')
      }
    }
  }

  const handleSelectTable = (tableId: string): void => {
    setActiveTableId(tableId)
    setRestaurantStage('ordering')
  }

  if (store == null) {
    return <div style={{ padding: '2rem' }}>Đang tải thông tin cửa hàng…</div>
  }

  const showProductGrid =
    store.isRestaurant !== true || restaurantStage === 'ordering'

  return (
    <div className='pos-page'>
      <div className='pos-left'>
        <section className='pos-session-banner'>
          <div>
            <h2>{store.name}</h2>
            <p>
              {store.isRestaurant === true
                ? restaurantStage === 'ordering'
                  ? `Đang phục vụ bàn ${activeTableId ?? ''}`
                  : 'Vui lòng chọn bàn để bắt đầu phục vụ.'
                : sessionType === 'resume'
                  ? 'Tiếp tục phiên bán hàng đang hoạt động.'
                  : 'Mở phiên bán hàng mới.'}
            </p>
          </div>
          <div className='pos-session-banner-actions'>
            <span>Mã cửa hàng: {store.id}</span>
            <Button variant='secondary' onClick={() => setCloseModalOpen(true)}>
              Đóng
            </Button>
          </div>
        </section>

        {store.isRestaurant === true && restaurantStage === 'login' && (
          <RestaurantLogin
            storeName={store.name}
            onScanCard={() => handleRestaurantLogin()}
            onSelectCashier={() => handleRestaurantLogin()}
          />
        )}

        {store.isRestaurant === true && restaurantStage === 'floor' && (
          <RestaurantFloorView
            storeId={store.id}
            floors={store.floors}
            colors={store.tableColors}
            kitchenStages={store.kitchenStages}
            kitchenTickets={store.kitchenTickets}
            onSelectTable={handleSelectTable}
            onUpdateTableStatus={(tableId, guests, status) => {
              if (storeId != null) {
                updateTableStatus(storeId, tableId, { guests, status })
              }
            }}
            onUpdateTableConfig={(tableId, payload) => {
              if (storeId != null) {
                updateTableConfig(storeId, tableId, payload)
              }
            }}
            onUpdateColors={payload => {
              if (storeId != null) {
                updateTableColors(storeId, payload)
              }
            }}
            onUpdateKitchenStage={(ticketId, itemId, stageId) => {
              if (storeId != null) {
                updateKitchenStage(storeId, { ticketId, itemId, stageId })
              }
            }}
            onToggleKitchenServed={(ticketId, itemId, served) => {
              if (storeId != null) {
                toggleKitchenServed(storeId, { ticketId, itemId, served })
              }
            }}
          />
        )}

        {showProductGrid && (
          <>
            <div className='pos-filters'>
              <div className='pos-search'>
                <input
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder='Quét mã vạch, nhập tên sản phẩm...'
                />
                <Button variant='ghost'>Quét mã</Button>
              </div>
              <div className='pos-category-filter'>
                <Button variant='secondary'>Danh mục</Button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'secondary'}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            <ProductGrid
              products={filteredProducts}
              onSelect={handleAddToCart}
              activeProductId={undefined}
            />
          </>
        )}
      </div>

      {showProductGrid ? (
        <CartPanel
          items={cart}
          products={products}
          paymentValue={paymentValue}
          orderNote={orderNote}
          onPaymentInput={handlePaymentInput}
          onPaymentClear={handlePaymentClear}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
          onCheckout={() => setCheckoutOpen(true)}
          onClear={() => {
            setCart([])
            setPaymentValue('')
            setOrderNote('')
          }}
          onAction={handleCartAction}
        />
      ) : (
        store.isRestaurant === true && (
          <div className='pos-cart' style={{ justifyContent: 'center', alignItems: 'center' }}>
            <p>Chọn bàn để bắt đầu order. Giỏ hàng sẽ xuất hiện tại đây.</p>
          </div>
        )
      )}

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        totalAmount={totalAmount}
        onConfirm={method => {
          console.log('Thanh toán bằng', method)
          setCart([])
          setPaymentValue('')
          setOrderNote('')
        }}
      />

      <CashControlModal
        isOpen={cashModalOpen && sessionType === 'new'}
        cashValue={openingCash}
        noteValue={openingNote}
        onCashChange={setOpeningCash}
        onNoteChange={setOpeningNote}
        onConfirm={handleConfirmCash}
        onCancel={handleCancelCash}
        error={cashError}
        sessionType={sessionType}
        storeName={store.name}
      />

      <CloseSessionModal
        isOpen={closeModalOpen}
        totals={{
          totalAmount,
          totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
          totalLines: cart.length
        }}
        countedCash={closingCash}
        note={closingNote}
        onCountedCashChange={setClosingCash}
        onNoteChange={setClosingNote}
        onCloseSession={handleCloseSession}
        onKeepSession={handleKeepSession}
        onContinueSelling={handleContinueSelling}
        onRequestClose={() => setCloseModalOpen(false)}
      />
      <CartActionModal
        state={actionModal}
        onClose={() => setActionModal({ type: 'none' })}
        onUpdate={setActionModal}
        onApply={(payload) => {
          if (payload.type === 'note') {
            const trimmed = payload.noteDraft.trim()
            setOrderNote(trimmed)
            openMessageModal(
              'Ghi chú đơn hàng',
              trimmed.length > 0
                ? 'Đã lưu ghi chú cho đơn hàng hiện tại.'
                : 'Đã xóa ghi chú đơn hàng.'
            )
            return
          }

          if (payload.type === 'scan') {
            const code = payload.code.trim()
            openMessageModal(
              'Nhập mã',
              code.length > 0
                ? `Đã nhận mã ${code}. Tích hợp xử lý nghiệp vụ khi kết nối backend.`
                : 'Bạn chưa nhập mã nào.'
            )
            return
          }
          setActionModal({ type: 'none' })
        }}
      />
    </div>
  )
}
