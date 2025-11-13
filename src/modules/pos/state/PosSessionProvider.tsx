import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'
import type { ReactNode } from 'react'
import type {
  CartItem,
  KitchenTicket,
  KitchenTicketItem,
  RestaurantFloor,
  RestaurantTable,
  TableStatus,
  TableStatusColorScheme
} from '../../../shared/types'
import { mockStores } from '../data/stores'

interface StoreSession {
  id: string
  name: string
  status: 'new' | 'active'
  lastClosedDate?: string
  lastCashBalance?: number
  isRestaurant?: boolean
  tableColors: TableStatusColorScheme
  floors: RestaurantFloor[]
  kitchenStages?: Array<{ id: string, name: string }>
  kitchenTickets: KitchenTicket[]
  openingCash?: number
  openingNote?: string
  cachedCart: CartItem[]
  cachedPayment: string
  openingAt?: string
  closingNote?: string
}

interface OpenSessionPayload {
  openingCash: number
  note?: string
}

interface SaveStatePayload {
  cart: CartItem[]
  paymentValue: string
}

interface CloseSessionPayload {
  countedCash: number
  note?: string
}

interface UpdateTableStatusPayload {
  guests: number
  status: TableStatus
}

interface UpdateTableConfigPayload {
  name?: string
  capacity?: number
  shape?: RestaurantTable['shape']
  colorOverrides?: RestaurantTable['colorOverrides']
  tags?: string[]
}

interface UpdateColorSchemePayload {
  idle?: string
  occupied?: string
  served?: string
}

interface CreateKitchenTicketPayload {
  tableId: string
  items: Omit<KitchenTicketItem, 'id' | 'stageId' | 'served'>[]
}

interface UpdateKitchenStagePayload {
  ticketId: string
  itemId: string
  stageId: string
}

interface ToggleKitchenServedPayload {
  ticketId: string
  itemId: string
  served: boolean
}

interface PosSessionContextValue {
  stores: StoreSession[]
  getStore: (storeId?: string) => StoreSession | undefined
  openSession: (storeId: string, payload: OpenSessionPayload) => void
  saveSessionState: (storeId: string, payload: SaveStatePayload) => void
  closeSession: (storeId: string, payload: CloseSessionPayload) => void
  updateTableStatus: (storeId: string, tableId: string, payload: UpdateTableStatusPayload) => void
  updateTableConfig: (storeId: string, tableId: string, payload: UpdateTableConfigPayload) => void
  updateTableColors: (storeId: string, payload: UpdateColorSchemePayload) => void
  createKitchenTicket: (storeId: string, payload: CreateKitchenTicketPayload) => void
  updateKitchenStage: (storeId: string, payload: UpdateKitchenStagePayload) => void
  toggleKitchenServed: (storeId: string, payload: ToggleKitchenServedPayload) => void
}

const cloneFloors = (floors?: RestaurantFloor[]): RestaurantFloor[] =>
  floors?.map(floor => ({
    ...floor,
    tables: floor.tables.map(table => ({
      ...table
    }))
  })) ?? []

const resetTableGuests = (floors: RestaurantFloor[]): RestaurantFloor[] =>
  floors.map(floor => ({
    ...floor,
    tables: floor.tables.map(table => ({
      ...table,
      currentGuests: 0,
      status: 'idle'
    }))
  }))

const PosSessionContext = createContext<PosSessionContextValue | undefined>(
  undefined
)

export function PosSessionProvider ({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<StoreSession[]>(() =>
    mockStores.map(store => ({
      id: store.id,
      name: store.name,
      status: store.status,
      lastClosedDate: store.lastClosedDate,
      lastCashBalance: store.lastCashBalance,
      isRestaurant: store.isRestaurant,
      tableColors: store.tableColors ?? {
        idle: '#2dd4bf',
        occupied: '#f97316',
        served: '#22d3ee'
      },
      floors: cloneFloors(store.floors),
      kitchenStages: store.kitchenStages,
      kitchenTickets: [],
      cachedCart: [],
      cachedPayment: '',
      openingCash: undefined,
      openingNote: undefined,
      openingAt: undefined,
      closingNote: undefined
    }))
  )

  const getStore = useCallback(
    (storeId?: string) => stores.find(item => item.id === storeId),
    [stores]
  )

  const setStoreState = useCallback(
    (storeId: string, updater: (store: StoreSession) => StoreSession) => {
      setStores(prev =>
        prev.map(store => (store.id === storeId ? updater(store) : store))
      )
    },
    []
  )

  const openSession = useCallback(
    (storeId: string, payload: OpenSessionPayload) => {
      setStoreState(storeId, store => ({
        ...store,
        status: 'active',
        openingCash: payload.openingCash,
        openingNote: payload.note,
        openingAt: new Date().toISOString(),
        cachedCart: [],
        cachedPayment: '',
        floors: resetTableGuests(store.floors),
        closingNote: undefined
      }))
    },
    [setStoreState]
  )

  const saveSessionState = useCallback(
    (storeId: string, payload: SaveStatePayload) => {
      setStoreState(storeId, store => ({
        ...store,
        status: 'active',
        cachedCart: payload.cart,
        cachedPayment: payload.paymentValue
      }))
    },
    [setStoreState]
  )

  const closeSession = useCallback(
    (storeId: string, payload: CloseSessionPayload) => {
      setStoreState(storeId, store => ({
        ...store,
        status: 'new',
        lastClosedDate: new Date().toISOString(),
        lastCashBalance: payload.countedCash,
        cachedCart: [],
        cachedPayment: '',
        openingCash: undefined,
        openingNote: undefined,
        openingAt: undefined,
        closingNote: payload.note,
        floors: resetTableGuests(store.floors),
        kitchenTickets: []
      }))
    },
    [setStoreState]
  )

  const updateTableStatus = useCallback(
    (storeId: string, tableId: string, payload: UpdateTableStatusPayload) => {
      setStoreState(storeId, store => ({
        ...store,
        floors: store.floors.map(floor => ({
          ...floor,
          tables: floor.tables.map(table =>
            table.id === tableId
              ? {
                  ...table,
                  currentGuests: payload.guests,
                  status: payload.status
                }
              : table
          )
        }))
      }))
    },
    [setStoreState]
  )

  const updateTableConfig = useCallback(
    (storeId: string, tableId: string, payload: UpdateTableConfigPayload) => {
      setStoreState(storeId, store => ({
        ...store,
        floors: store.floors.map(floor => ({
          ...floor,
          tables: floor.tables.map(table =>
            table.id === tableId
              ? {
                  ...table,
                  ...payload,
                  colorOverrides: payload.colorOverrides ?? table.colorOverrides
                }
              : table
          )
        }))
      }))
    },
    [setStoreState]
  )

  const updateTableColors = useCallback(
    (storeId: string, payload: UpdateColorSchemePayload) => {
      setStoreState(storeId, store => ({
        ...store,
        tableColors: {
          ...store.tableColors,
          ...payload
        }
      }))
    },
    [setStoreState]
  )

  const createKitchenTicket = useCallback(
    (storeId: string, payload: CreateKitchenTicketPayload) => {
      setStoreState(storeId, store => ({
        ...store,
        kitchenTickets: [
          ...store.kitchenTickets,
          {
            id: `ticket-${Date.now()}`,
            tableId: payload.tableId,
            createdAt: new Date().toISOString(),
            items: payload.items.map((item, index) => ({
              id: `${Date.now()}-${index}`,
              productId: item.productId,
              name: item.name,
              quantity: item.quantity,
              stageId: store.kitchenStages?.[0]?.id ?? 'stage-prep',
              served: false
            }))
          }
        ]
      }))
    },
    [setStoreState]
  )

  const updateKitchenStage = useCallback(
    (storeId: string, payload: UpdateKitchenStagePayload) => {
      setStoreState(storeId, store => ({
        ...store,
        kitchenTickets: store.kitchenTickets.map(ticket =>
          ticket.id === payload.ticketId
            ? {
                ...ticket,
                items: ticket.items.map(item =>
                  item.id === payload.itemId
                    ? { ...item, stageId: payload.stageId }
                    : item
                )
              }
            : ticket
        )
      }))
    },
    [setStoreState]
  )

  const toggleKitchenServed = useCallback(
    (storeId: string, payload: ToggleKitchenServedPayload) => {
      setStoreState(storeId, store => ({
        ...store,
        kitchenTickets: store.kitchenTickets.map(ticket =>
          ticket.id === payload.ticketId
            ? {
                ...ticket,
                items: ticket.items.map(item =>
                  item.id === payload.itemId
                    ? { ...item, served: payload.served }
                    : item
                )
              }
            : ticket
        )
      }))
    },
    [setStoreState]
  )

  const value = useMemo<PosSessionContextValue>(
    () => ({
      stores,
      getStore,
      openSession,
      saveSessionState,
      closeSession,
      updateTableStatus,
      updateTableConfig,
      updateTableColors,
      createKitchenTicket,
      updateKitchenStage,
      toggleKitchenServed
    }),
    [
      stores,
      getStore,
      openSession,
      saveSessionState,
      closeSession,
      updateTableStatus,
      updateTableConfig,
      updateTableColors,
      createKitchenTicket,
      updateKitchenStage,
      toggleKitchenServed
    ]
  )

  return (
    <PosSessionContext.Provider value={value}>
      {children}
    </PosSessionContext.Provider>
  )
}

export function usePosSession (): PosSessionContextValue {
  const context = useContext(PosSessionContext)
  if (context == null) {
    throw new Error('usePosSession must be used inside PosSessionProvider')
  }
  return context
}
