import React, { useMemo, useState } from 'react';
import cls from './ProductList.module.sass';
import { IProduct } from 'redux/ProductsSlice';
import { Product } from 'features/Product/ui/Product';
import { useAppSelector } from 'models/Hook';
import { haptic } from 'ios-haptics';

interface ProductListProps {
  products: IProduct[];
  actual?: boolean
}

export const ProductList: React.FC<ProductListProps> = ({ products, actual = true }) => {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("category");
  const [searchQuery, setSearchQuery] = useState("");
  const categories = useAppSelector(state => state.settings.category)

  const getProductList = () => {
    const used = products.filter(product => actual ? !product.used : product.used);
    const filteredItems = category === 'all'
      ? used
      : used.filter(item => item.category === category);

    filteredItems.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'category') return a.category.localeCompare(b.category);
      if (sort === 'date') return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
      return 0;
    });
    if (searchQuery.trim() !== '') {
      const lowSearch = searchQuery.toLowerCase();
      return filteredItems.filter(item =>
        item.name.toLowerCase().includes(lowSearch)
      );
    }
    return filteredItems;
  }
  const MemoizedList = useMemo(() => (
    getProductList().map((product) => (
      <Product
        key={product.id}
        product={product}
      />
    ))
  ), [products, category, searchQuery, sort]);

  return (
    <div className={cls.productList}>
      <div className={cls.controls}>
        <input placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <select onChange={(e) => setCategory(e.currentTarget.value)} value={category}>
          <option value="all">Все категории</option>
          {categories.map(cat => (<option key={cat.name} value={cat.name}>{cat.name}</option>))}
        </select>
        <select onChange={(e) => setSort(e.currentTarget.value)} value={sort}>
          <option value="date">Сортировка: по сроку</option>
          <option value="name">Сортировка: по названию</option>
          <option value="category">Сортировка: по категории</option>
        </select>
      </div>
      <div className={cls.productList}>
        {MemoizedList}
      </div>
    </div>
  );
};