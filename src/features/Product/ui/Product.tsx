// Product.tsx
import React, { useEffect, useState } from "react";
import { getProducts, IProduct, removeProduct, updateUsedProduct } from "redux/ProductsSlice";
import { useAppDispatch, useAppSelector } from "models/Hook";
import { Status } from "models/Status";
import cls from "./Product.module.sass";
import { CardWithMenu } from "features/CardWithMenu/ui/CardWithMenu";
import { AddNewProduct } from "features/AddNewProduct";

export const Product = ({ product }: { product: IProduct }) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.products.status);
  const [isEdit, setIsEdit] = useState(false);
  const isMenuVisible = useAppSelector(state => state.products.isModal)
  const [shouldEditAfterClose, setShouldEditAfterClose] = useState(false);

  const toUsedHandler = () => {
    dispatch(updateUsedProduct(product.id));
    if (status === Status.Succeeded) {
      dispatch(getProducts());
    }
  };

  const handleRemove = () => {
    dispatch(removeProduct(product.id));
    if (status === Status.Succeeded) {
      dispatch(getProducts());
    }
  };

  const handleEdit = () => {  // Кнопка "Edit"
    if (isMenuVisible) {
      setShouldEditAfterClose(true);  // Устанавливаем флаг ожидания
      return;
    }
    setIsEdit(true);  // Если меню закрыто — сразу
  };

  useEffect(() => {
    if (!isMenuVisible && shouldEditAfterClose) {
      setIsEdit(true);           // Edit режим!
      setShouldEditAfterClose(false);  // Сбрасываем флаг (один раз)
    }
  }, [isMenuVisible, shouldEditAfterClose]);

  return (
    <>
      <CardWithMenu
        onEdit={handleEdit}
        onArchive={toUsedHandler}
        onRemove={handleRemove}
        isArchived={product.used}
      >
        <div className={`${cls.mitem} ${cls.rowOk}`} key={product.id}>
          <div className={cls.mhead}>
            <div className={cls.title}>
              <div
                className={cls.mname}
                style={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {product.name}
              </div>
              <div
                className={cls.small}
                style={{ display: "flex", gap: "8px", flexWrap: "nowrap" }}
              >
                <span className={cls.chip}>{product.category}</span>
                <span className={cls.chip}>{product.months} мес.</span>
              </div>
            </div>
          </div>
          <div
            className={cls.meta}
            style={{ gridTemplateColumns: "0.6fr 1fr 1fr", gap: "8px 10px" }}
          >
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
        </div>
      </CardWithMenu>
      <AddNewProduct isOpen={isEdit} onClose={() => setIsEdit(false)} product={product} />
    </>

  );
};