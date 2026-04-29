import { classNames } from "shared/lib/classNames";
import cls from './Dashboard.module.sass';

export interface DashboardProps {
  className?: string;
}

export const Dashboard = ({ className }: DashboardProps) => {

  return (
    <div className={classNames(cls.dashboard, {}, [className])}>
``
      <div className={cls.panelH}>
        <h2>Дашборд</h2>
        <div className={cls.small} id="lastSaved">Не сохранено</div>
      </div>
      <div className={cls.panelB}>
        <div className={cls.tabs}>
          <button className={`${cls.tab} ${cls.active}`} id="tabActive">Активные</button>
          <button className={cls.tab} id="tabArchive">Архив</button>
        </div>
        <div className={cls.stats}>
          <div className={cls.stat}>
            <div className={cls.k}>Всего позиций</div>
            <div className={cls.v} id="sTotal">0</div></div>
          <div className={cls.stat}>
            <div className={cls.k}>Скоро съесть</div>
            <div className={cls.v} id="sSoon">0</div></div>
          <div className={cls.stat}>
            <div className={cls.k}>Просрочено</div>
            <div className={cls.v} id="sBad">0</div></div>
        </div>
      </div>
    </div>
  );
};
