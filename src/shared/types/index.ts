export interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  category: string
  image?: string
}

export interface CartItem {
  productId: string
  quantity: number
  note?: string
  discountPercent?: number
}

export type OrderStatus = 'completed' | 'pending' | 'cancelled' | 'refunded'

export interface Order {
  id: string
  code: string
  customerName?: string
  totalAmount: number
  status: OrderStatus
  createdAt: string
  paymentMethod: 'cash' | 'card' | 'transfer'
  channel: 'POS' | 'Online'
}

export type TableShape = 'square' | 'round'
export type TableStatus = 'idle' | 'occupied' | 'served'

export interface TableStatusColorScheme {
  idle: string
  occupied: string
  served: string
}

export interface RestaurantTable {
  id: string
  name: string
  capacity: number
  currentGuests: number
  shape: TableShape
  status: TableStatus
  colorOverrides?: Partial<TableStatusColorScheme>
  tags?: string[]
}

export interface RestaurantFloor {
  id: string
  name: string
  tables: RestaurantTable[]
}

export interface KitchenStage {
  id: string
  name: string
}

export interface KitchenTicketItem {
  id: string
  productId: string
  name: string
  quantity: number
  stageId: string
  served: boolean
}

export interface KitchenTicket {
  id: string
  tableId: string
  createdAt: string
  items: KitchenTicketItem[]
}

export type PosStoreStatus = 'new' | 'active'

export interface PosStore {
  id: string
  name: string
  lastClosedDate?: string
  lastCashBalance?: number
  status: PosStoreStatus
  isRestaurant?: boolean
  tableColors?: TableStatusColorScheme
  floors?: RestaurantFloor[]
  kitchenStages?: KitchenStage[]
}
