import type {
  PosStore,
  RestaurantFloor,
  TableStatusColorScheme
} from '../../../shared/types'

const defaultColors: TableStatusColorScheme = {
  idle: '#2dd4bf',
  occupied: '#f97316',
  served: '#22d3ee'
}

const generateFloors = (floors: Array<{ id: string, name: string, tables: Array<Partial<RestaurantFloor['tables'][number]>> }>, colors: TableStatusColorScheme): RestaurantFloor[] =>
  floors.map(floor => ({
    id: floor.id,
    name: floor.name,
    tables: floor.tables.map((table, index) => ({
      id: table.id ?? `${floor.id}-table-${index + 1}`,
      name: table.name ?? `Bàn ${index + 1}`,
      capacity: table.capacity ?? 4,
      currentGuests: table.currentGuests ?? 0,
      shape: table.shape ?? 'square',
      status: table.status ?? 'idle',
      colorOverrides: table.colorOverrides,
      tags: table.tags ?? []
    }))
  }))

export const mockStores: PosStore[] = [
  {
    id: 'store-shop',
    name: 'Shop',
    lastClosedDate: '2025-08-18',
    lastCashBalance: 0,
    status: 'new'
  },
  {
    id: 'store-coffee-j',
    name: 'Coffee J',
    lastClosedDate: '2025-10-03',
    lastCashBalance: 0,
    status: 'new',
    isRestaurant: true,
    tableColors: defaultColors,
    floors: generateFloors(
      [
        {
          id: 'floor-1',
          name: 'Tầng 1',
          tables: [
            { id: 'coffeej-1', name: 'Bàn 1', capacity: 4, shape: 'square' },
            { id: 'coffeej-2', name: 'Bàn 2', capacity: 5, shape: 'round' },
            { id: 'coffeej-3', name: 'Bàn 3', capacity: 4, shape: 'square' }
          ]
        },
        {
          id: 'floor-2',
          name: 'Tầng 2',
          tables: [
            { id: 'coffeej-4', name: 'Bàn 4', capacity: 6, shape: 'round' },
            { id: 'coffeej-5', name: 'VIP 1', capacity: 8, shape: 'square', colorOverrides: { idle: '#a855f7' }, tags: ['VIP'] }
          ]
        }
      ],
      defaultColors
    ),
    kitchenStages: [
      { id: 'stage-prep', name: 'Đang chế biến' },
      { id: 'stage-ready', name: 'Hoàn tất' },
      { id: 'stage-served', name: 'Đã phục vụ' }
    ]
  },
  {
    id: 'store-grocery',
    name: 'Tạp hóa',
    lastClosedDate: '2025-10-14',
    lastCashBalance: 0,
    status: 'active'
  },
  {
    id: 'store-badminton',
    name: 'Cầu lông',
    lastClosedDate: '2025-09-19',
    lastCashBalance: 0,
    status: 'active'
  }
]
