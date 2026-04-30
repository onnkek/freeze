import { classNames } from "shared/lib/classNames";
import cls from './ArchivePage.module.sass';
import { Page } from "widgets/Page";
import { ProductList } from "features/ProductList";
import { AddNewProduct } from "features/AddNewProduct";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "models/Hook";
import { getProducts } from "redux/ProductsSlice";
import { getSettings } from "redux/SettingsSlice";

export interface ArchivePageProps {
  className?: string;
}

export const ArchivePage = ({ className }: ArchivePageProps) => {
const [isOpenAdd, setIsOpenAdd] = useState(false);
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getProducts())
    dispatch(getSettings())
  }, [dispatch])
  const products = useAppSelector(state => state.products)
  const categories = useAppSelector(state => state.settings.category)
  return (
    <Page className={classNames(cls.dashboardPage, {}, [className])}>
      <div className={cls.app}>
        <main className={cls.main}>
          <section className={cls.content}>
            <div className={cls.grid}>
              <ProductList products={products.products} actual={false}/>
              {/* <AddNewProduct isOpen={isOpenAdd} onClose={() => setIsOpenAdd(false)} /> */}
            </div>
          </section>
        </main>
      </div>
    </Page>
  );
};
