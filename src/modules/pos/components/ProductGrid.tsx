import { memo } from 'react';
import { Product } from '../../../shared/types';
import { formatCurrency } from '../../../shared/utils/format';
import clsx from 'clsx';

interface ProductGridProps {
  products: Product[];
  activeProductId?: string;
  onSelect: (product: Product) => void;
}

export const ProductGrid = memo(function ProductGrid({
  products,
  activeProductId,
  onSelect
}: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <button
          type="button"
          key={product.id}
          className={clsx('product-card', {
            'product-card-active': activeProductId === product.id
          })}
          onClick={() => onSelect(product)}
        >
          {product.image && (
            <img src={product.image} alt={product.name} loading="lazy" />
          )}
          <div className="product-body">
            <h3>{product.name}</h3>
            <p className="product-price">{formatCurrency(product.price)}</p>
            <p className="product-stock">Tồn kho: {product.stock}</p>
          </div>
        </button>
      ))}
    </div>
  );
});
