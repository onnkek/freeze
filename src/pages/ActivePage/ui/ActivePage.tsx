import { classNames } from "shared/lib/classNames";
import cls from './ActivePage.module.sass';
import { ProductList } from "features/ProductList";
import { useEffect, useState } from "react";
import { AddNewProduct } from "features/AddNewProduct";
import { Page } from "widgets/Page";
import { Button } from "shared/ui/Button";
import { ReactComponent as PlusIcon } from 'shared/assets/icons/aquarium/plus.svg'
import { getSettings } from "redux/SettingsSlice";
import { useAppDispatch } from "models/Hook";

export interface ActivePageProps {
  className?: string;
}

export const ActivePage = ({ className }: ActivePageProps) => {

  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getSettings())
  }, [dispatch])

  return (
    <Page className={classNames(cls.activePage, {}, [className])}>
      <div className={cls.app}>
        <main className={cls.main}>
          <section className={cls.content}>
            <div className={cls.grid}>
              {isOpenAdd || <Button theme='clear' className={cls.addButton} onClick={() => setIsOpenAdd(true)}>
                <PlusIcon />
              </Button>}
              <ProductList />
              <AddNewProduct isOpen={isOpenAdd} onClose={() => setIsOpenAdd(false)} />
            </div>
          </section>
        </main>
      </div>
    </Page>
  );
};
