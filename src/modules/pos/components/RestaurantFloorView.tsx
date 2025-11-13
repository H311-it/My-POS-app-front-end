import { useMemo, useState } from 'react'
import type {
  KitchenTicket,
  KitchenStage,
  RestaurantFloor,
  TableStatusColorScheme
} from '../../../shared/types'
import { Button } from '../../../shared/components/ui/Button'
import '../restaurant.css'

interface RestaurantFloorViewProps {
  storeId: string
  floors: RestaurantFloor[]
  colors: TableStatusColorScheme
  kitchenStages?: KitchenStage[]
  kitchenTickets: KitchenTicket[]
  onSelectTable: (tableId: string) => void
  onUpdateTableStatus: (tableId: string, guests: number, status: RestaurantFloor['tables'][number]['status']) => void
  onUpdateTableConfig: (tableId: string, payload: { name?: string, capacity?: number, shape?: 'square' | 'round', colorOverrides?: Partial<TableStatusColorScheme>, tags?: string[] }) => void
  onUpdateColors: (payload: Partial<TableStatusColorScheme>) => void
  onUpdateKitchenStage: (ticketId: string, itemId: string, stageId: string) => void
  onToggleKitchenServed: (ticketId: string, itemId: string, served: boolean) => void
}

export function RestaurantFloorView ({
  floors,
  colors,
  kitchenStages,
  kitchenTickets,
  onSelectTable,
  onUpdateTableStatus,
  onUpdateTableConfig,
  onUpdateColors,
  onUpdateKitchenStage,
  onToggleKitchenServed
}: RestaurantFloorViewProps): JSX.Element {
  const [activeFloorId, setActiveFloorId] = useState(floors[0]?.id)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)

  const activeFloor = useMemo(
    () => floors.find(floor => floor.id === activeFloorId) ?? floors[0],
    [floors, activeFloorId]
  )

  const selectedTable = useMemo(() => {
    if (selectedTableId == null) return undefined
    return floors.flatMap(floor => floor.tables).find(table => table.id === selectedTableId)
  }, [floors, selectedTableId])

  const tableTickets = useMemo(() => {
    if (selectedTableId == null) return []
    return kitchenTickets.filter(ticket => ticket.tableId === selectedTableId)
  }, [kitchenTickets, selectedTableId])

  return (
    <div className='restaurant-floor-wrapper'>
      <section>
        <div className='restaurant-floor-tabs'>
          {floors.map(floor => (
            <button
              key={floor.id}
              className={floor.id === activeFloor?.id ? 'active' : ''}
              type='button'
              onClick={() => setActiveFloorId(floor.id)}
            >
              {floor.name}
            </button>
          ))}
        </div>
        <div className='floor-canvas'>
          {activeFloor?.tables.map(table => {
            const statusColors = {
              idle: table.colorOverrides?.idle ?? colors.idle,
              occupied: table.colorOverrides?.occupied ?? colors.occupied,
              served: table.colorOverrides?.served ?? colors.served
            }
            const background =
              table.status === 'idle'
                ? statusColors.idle
                : table.status === 'occupied'
                  ? statusColors.occupied
                  : statusColors.served

            return (
              <button
                type='button'
                key={table.id}
                className={`table-chip ${table.shape} ${selectedTableId === table.id ? 'active' : ''}`}
                style={{ background }}
                onClick={() => {
                  setSelectedTableId(table.id)
                  onSelectTable(table.id)
                }}
              >
                <strong>{table.name}</strong>
                <span>
                  {table.currentGuests}/{table.capacity}
                </span>
                {table.tags?.length != null && table.tags.length > 0 && (
                  <span>{table.tags.join(', ')}</span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      <aside className='table-inspector'>
        {selectedTable == null ? (
          <p>Chọn một bàn để xem chi tiết, cập nhật trạng thái và cấu hình.</p>
        ) : (
          <>
            <div className='inspector-section'>
              <h3>Thông tin bàn {selectedTable.name}</h3>
              <div className='inspector-grid'>
                <label>
                  Tên bàn
                  <input
                    value={selectedTable.name}
                    onChange={event =>
                      onUpdateTableConfig(selectedTable.id, { name: event.target.value })
                    }
                  />
                </label>
                <label>
                  Số khách tối đa
                  <input
                    type='number'
                    min={1}
                    value={selectedTable.capacity}
                    onChange={event =>
                      onUpdateTableConfig(selectedTable.id, { capacity: Number(event.target.value) })
                    }
                  />
                </label>
                <label>
                  Hình dạng
                  <select
                    value={selectedTable.shape}
                    onChange={event =>
                      onUpdateTableConfig(selectedTable.id, { shape: event.target.value as 'square' | 'round' })
                    }
                  >
                    <option value='square'>Hình vuông</option>
                    <option value='round'>Hình tròn</option>
                  </select>
                </label>
              </div>
              <div className='inspector-grid'>
                <label>
                  Khách hiện tại
                  <input
                    type='number'
                    min={0}
                    value={selectedTable.currentGuests}
                    onChange={event =>
                      onUpdateTableStatus(selectedTable.id, Number(event.target.value), Number(event.target.value) > 0 ? 'occupied' : 'idle')
                    }
                  />
                </label>
                <label>
                  Ghi chú nhãn
                  <input
                    value={selectedTable.tags?.join(', ') ?? ''}
                    onChange={event =>
                      onUpdateTableConfig(selectedTable.id, {
                        tags: event.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      })
                    }
                    placeholder='VIP, Sân vườn...'
                  />
                </label>
              </div>
              <div className='inspector-grid'>
                <Button
                  variant='primary'
                  onClick={() => onUpdateTableStatus(selectedTable.id, selectedTable.capacity, 'occupied')}
                >
                  Đánh dấu đã nhận khách
                </Button>
                <Button
                  variant='secondary'
                  onClick={() => onUpdateTableStatus(selectedTable.id, selectedTable.currentGuests, 'served')}
                >
                  Hoàn tất phục vụ
                </Button>
                <Button
                  variant='ghost'
                  onClick={() => onUpdateTableStatus(selectedTable.id, 0, 'idle')}
                >
                  Trả bàn
                </Button>
              </div>
            </div>

            <div className='inspector-section'>
              <h3>Tuỳ chỉnh màu trạng thái</h3>
              <div className='inspector-grid'>
                <label>
                  Trống
                  <input
                    type='color'
                    value={colors.idle}
                    onChange={event => onUpdateColors({ idle: event.target.value })}
                  />
                </label>
                <label>
                  Đang phục vụ
                  <input
                    type='color'
                    value={colors.occupied}
                    onChange={event => onUpdateColors({ occupied: event.target.value })}
                  />
                </label>
                <label>
                  Đã phục vụ
                  <input
                    type='color'
                    value={colors.served}
                    onChange={event => onUpdateColors({ served: event.target.value })}
                  />
                </label>
              </div>
            </div>

            <div className='inspector-section'>
              <h3>Nhật ký bếp</h3>
              {tableTickets.length === 0 && <p>Chưa có món nào gửi bếp cho bàn này.</p>}
              {tableTickets.map(ticket => (
                <div key={ticket.id} className='kitchen-ticket'>
                  <strong>Phiếu {ticket.id}</strong>
                  {ticket.items.map(item => (
                    <div key={item.id} className='kitchen-item'>
                      <div>
                        <div>{item.name}</div>
                        <small>Số lượng: {item.quantity}</small>
                      </div>
                      <select
                        value={item.stageId}
                        onChange={event =>
                          onUpdateKitchenStage(ticket.id, item.id, event.target.value)
                        }
                      >
                        {kitchenStages?.map(stage => (
                          <option key={stage.id} value={stage.id}>
                            {stage.name}
                          </option>
                        )) ?? (
                          <>
                            <option value='stage-prep'>Đang chế biến</option>
                            <option value='stage-ready'>Hoàn tất</option>
                            <option value='stage-served'>Đã phục vụ</option>
                          </>
                        )}
                      </select>
                      <button
                        type='button'
                        onClick={() =>
                          onToggleKitchenServed(ticket.id, item.id, !item.served)
                        }
                      >
                        {item.served ? 'Đánh dấu chưa phục vụ' : 'Đánh dấu đã phục vụ'}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
