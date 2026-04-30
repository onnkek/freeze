import { classNames } from "shared/lib/classNames";
import cls from './AddNewProduct.module.sass';
import { useAppDispatch, useAppSelector } from "models/Hook";
import { useEffect, useState } from "react";
import { createProduct, getProducts, IProduct, updateProduct } from "redux/ProductsSlice";
import { Modal } from "shared/ui/Modal";
import { Status } from "models/Status";

export interface AddNewProductProps {
  className?: string;
  isOpen?: boolean;
  onClose: () => void
  product?: IProduct
}

export const AddNewProduct = ({ className, isOpen, onClose, product }: AddNewProductProps) => {

  const dispatch = useAppDispatch()

  // useEffect(() => {
  //   dispatch(getProducts())
  // }, [dispatch])

  const categories = useAppSelector(state => state.settings.category)

  const status = useAppSelector(state => state.products.status)
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(product?.category || "Мясо");
  const [qty, setQty] = useState(product?.qty || "1");
  const [unit, setUnit] = useState(product?.unit || "кг");
  const [date, setDate] = useState(product?.frozenAt || new Date(Date.now()).toISOString().split('T')[0]);
  const [months, setMonths] = useState(product?.months || "6");

  const addNewProductHandler = async () => {
    const qyolity = qty
    const ms = months

    if (product) {
      await dispatch(updateProduct({
        id: product.id,
        name,
        category,
        qty: qyolity,
        unit,
        frozenAt: date,
        months: ms,
        expiresAt: product.expiresAt,
        used: product.used
      }));
    } else {
      await dispatch(createProduct({
        name,
        category,
        qyolity,
        unit,
        date,
        months: ms
      }));
    }


    if (status === Status.Succeeded) {
      dispatch(getProducts())
    }
    onClose();
  }

  return (
    <Modal
      headerText="Add new product"
      onConfirm={addNewProductHandler}
      isOpen={isOpen}
      onClose={onClose}
      className={classNames(cls.addNewProduct, {}, [className])}
    >
      <section className={cls.card}>
        <h2 className={cls.sectionTitle}>General</h2>
        <div className={cls.field}>
          <label htmlFor="pumpName">Название</label>
          <input id="pumpName" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className={cls.field}>
          <label htmlFor="dose">Категория</label>
          <select id="dose" onChange={(e) => setCategory(e.currentTarget.value)} value={category}>
            {categories.map(cat => (<option key={cat.name} value={cat.name}>{cat.name}</option>))}
          </select>
        </div>
        <div className={cls.field}>
          <label htmlFor="performance">Количество</label>
          <input id="performance" type="text" inputMode="decimal" value={qty} onChange={(e) => setQty(e.target.value)} />
        </div>
        {/* <div className={cls.field}>
          <label htmlFor="remaining">Ед. изм.</label>
          <input id="remaining" type="text" value={unit} onChange={(e) => setUnit(e.target.value)} />
        </div> */}
        <div className={cls.field}>
          <label htmlFor="dose">Категория</label>
          <select id="dose" onChange={(e) => setUnit(e.currentTarget.value)} value={unit}>
            <option value="кг">кг</option>
            <option value="шт">шт</option>
            <option value="л">л</option>
          </select>
        </div>
        <div className={cls.field}>
          <label htmlFor="maxVolume">Заморожено</label>
          <input id="maxVolume" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className={`${cls.field} ${cls.m0}`}>
          <label htmlFor="maxVolume">Срок хранения</label>
          <input id="maxVolume" type="text" inputMode="decimal" value={months} onChange={(e) => setMonths(e.target.value)} />
        </div>
      </section>
    </Modal>
  );
};
