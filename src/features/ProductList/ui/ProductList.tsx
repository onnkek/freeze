import { classNames } from "shared/lib/classNames";
import cls from './ProductList.module.sass';
import { useAppDispatch, useAppSelector } from "models/Hook";
import { useEffect, useState } from "react";
import { getProducts, removeProduct, updateUsedProduct } from "redux/ProductsSlice";
import { Status } from "models/Status";
import { ReactComponent as ArchiveIcon } from 'shared/assets/icons/aquarium/archive.svg'
import { ReactComponent as ClockwiseIcon } from 'shared/assets/icons/aquarium/arrow-clockwise.svg'

export interface ProductListProps {
  className?: string;
  actual?: boolean
}

export const ProductList = ({ className, actual = true }: ProductListProps) => {

  const dispatch = useAppDispatch()
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("category");
  const [searchQuery, setSearchQuery] = useState("");
  const status = useAppSelector(state => state.products.status)
  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  const products = useAppSelector(state => state.products)
  const categories = useAppSelector(state => state.settings.category)
  const toUsedHandler = (id: string) => {
    dispatch(updateUsedProduct(id))
    if (status === Status.Succeeded) {
      dispatch(getProducts())
    }
  }
  const removeHandler = (id: string) => {
    dispatch(removeProduct(id))
    if (status === Status.Succeeded) {
      dispatch(getProducts())
    }
  }

  const getProductList = () => {
    const used = products.products.filter(product => actual ? !product.used : product.used);
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

  return (
    <div className={classNames(cls.productList, {}, [className])}>

      <div className={cls.panelB}>
        <div className={cls.controls}>
          <input id="search" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <select id="dose" onChange={(e) => setCategory(e.currentTarget.value)} value={category}>
            <option value="all">Все категории</option>
            {categories.map(cat => (<option key={cat.name} value={cat.name}>{cat.name}</option>))}
          </select>
          <select id="sortBy" onChange={(e) => setSort(e.currentTarget.value)} value={sort}>
            <option value="date">Сортировка: по сроку</option>
            <option value="name">Сортировка: по названию</option>
            <option value="category">Сортировка: по категории</option>
          </select>
        </div>
        <div className={`${cls.tableWrap} ${cls.desktopOnly}`}>
          <table>
            <thead>
              <tr>
                <th>Продукт</th>
                <th>Категория</th>
                <th>Кол-во</th>
                <th>Ед.</th>
                <th>Заморозка</th>
                <th>Срок, мес.</th>
                <th>Съесть до</th>
                <th>Действия</th>
              </tr></thead>
            <tbody id="tbody">

              {getProductList().map(product => (
                <tr className={cls.rowOk} key={product.id}>
                  <td>{product.name}</td>
                  <td>
                    <span className={cls.chip}>{product.category}</span>
                  </td>
                  <td>{product.qty}</td>
                  <td>{product.unit}</td>
                  <td>{product.frozenAt}</td>
                  <td>{product.months}</td>
                  <td>{product.expiresAt}</td>
                  <td>
                    <div className={cls.actions}>
                      <button className={cls.btnGhost} onClick={(e) => toUsedHandler(product.id)}>
                        {actual ? <ArchiveIcon /> : <ClockwiseIcon />}
                      </button>
                      {/* <button className={cls.btnDanger} onClick={(e) => removeHandler(product.id)}>Удалить</button> */}
                    </div>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
        <div className={cls.mobileList} id="mobileList">

          {getProductList().filter(product => actual ? !product.used : product.used).map(product => (
            <div className={`${cls.mitem} ${cls.rowOk}`} key={product.id}>
              <div className={cls.mhead}>
                <div style={{ display: "grid", gap: "6px", minWidth: "0", flex: "1" }}>
                  <div className={cls.mname} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</div>
                  <div className={cls.small} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span className={cls.chip}>{product.category}</span>
                    {/* <span className={cls.chip}>{product.qty} {product.unit}</span> */}
                    <span className={cls.chip}>{product.months} мес.</span>
                  </div>
                </div>
              </div>
              <div className={cls.meta} style={{ gridTemplateColumns: "0.6fr 1fr 1fr", gap: "8px 10px" }}>
                <div>
                  <span className={cls.muted}>Кол-во</span>
                  <strong>{product.qty} {product.unit}</strong>
                </div>
                <div>
                  <span className={cls.muted}>Заморозка</span>
                  <strong>{product.frozenAt}</strong>
                </div>
                <div>
                  <span className={cls.muted}>Съесть до</span>
                  <strong>{product.expiresAt}</strong>
                </div>
              </div>
              <button className={cls.btnGhost} onClick={(e) => toUsedHandler(product.id)}>
                {actual ? <ArchiveIcon /> : <ClockwiseIcon />}
              </button>
              {/* <button className={cls.mclose} aria-label="Удалить" title="Удалить" onClick={(e) => removeHandler(product.id)}>×</button> */}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};
