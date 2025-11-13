import { Card } from '../../../shared/components/ui/Card';
import { formatCurrency } from '../../../shared/utils/format';
import '../styles/charts.css';

const kpis = [
  { title: 'Doanh thu hôm nay', value: 12500000, delta: '+12.4%' },
  { title: 'Đơn hàng', value: 182, delta: '+8.2%' },
  { title: 'Khách quay lại', value: 64, delta: '+5.1%' },
  { title: 'Giá trị đơn TB', value: 189000, delta: '+3.4%' }
];

const topProducts = [
  { name: 'Cà phê sữa đá', value: 320, color: 'rgba(37, 99, 235, 0.9)' },
  { name: 'Trà đào cam sả', value: 275, color: 'rgba(16, 185, 129, 0.85)' },
  { name: 'Bánh croissant', value: 198, color: 'rgba(245, 158, 11, 0.85)' },
  { name: 'Sinh tố xoài', value: 162, color: 'rgba(239, 68, 68, 0.85)' }
];

const hourlySales = [45, 52, 60, 85, 120, 140, 110];

export function ChartsPage(): JSX.Element {
  return (
    <div className="charts-page">
      <section className="kpi-grid">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="kpi-card">
            <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>{kpi.title}</span>
            <strong style={{ fontSize: '1.5rem' }}>
              {kpi.title === 'Đơn hàng' || kpi.title === 'Khách quay lại'
                ? kpi.value.toLocaleString('vi-VN')
                : formatCurrency(kpi.value)}
            </strong>
            <span className="kpi-trend">{kpi.delta} so với hôm qua</span>
          </div>
        ))}
      </section>

      <div className="charts-grid">
        <Card
          className="charts-card"
          title="Top sản phẩm bán chạy"
          subtitle="Số lượng bán trong 7 ngày gần nhất"
        >
          <div>
            {topProducts.map((item) => (
              <div className="bar-row" key={item.name}>
                <span>{item.name}</span>
                <div className="bar-track">
                  <span
                    className="bar-fill"
                    style={{
                      width: `${(item.value / topProducts[0].value) * 100}%`,
                      background: item.color
                    }}
                  />
                </div>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card
          className="charts-card"
          title="Doanh thu theo khung giờ"
          subtitle="Số liệu cập nhật theo thời gian thực"
        >
          <div className="mini-chart">
            {hourlySales.map((value, index) => (
              <div
                key={index}
                className="mini-chart-bar"
                style={{ height: `${value}%` }}
                aria-label={`Giờ ${index + 9}:00 - ${value} đơn`}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
