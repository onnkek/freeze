import { classNames } from "shared/lib/classNames";
import cls from './ArchivePage.module.sass';
import { Page } from "widgets/Page";
import { ProductList } from "features/ProductList";
import { AddNewProduct } from "features/AddNewProduct";

export interface ArchivePageProps {
  className?: string;
}

export const ArchivePage = ({ className }: ArchivePageProps) => {

  return (
    <Page className={classNames(cls.dashboardPage, {}, [className])}>
      <div className={cls.app}>
        <main className={cls.main}>
          <section className={cls.content}>
            <div className={cls.grid}>
              <ProductList actual={false}/>
              {/* <AddNewProduct isOpen={isOpenAdd} onClose={() => setIsOpenAdd(false)} /> */}
            </div>
          </section>
        </main>
      </div>
    </Page>
  );
};
