import { ArchivePage } from "pages/ArchivePage";
import { ActivePage } from "pages/ActivePage";
import { RouteProps } from 'react-router-dom';

export type AppRoutesProps = RouteProps & {
  // authOnly?: boolean;
  // roles?: UserRole[];
}

export enum AppRoutes {
  ACTIVE = 'active',
  ARCHIVE = 'archive',
  NOT_FOUND = 'not_found'
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.ACTIVE]: '/',
  [AppRoutes.ARCHIVE]: '/archive',
  [AppRoutes.NOT_FOUND]: '*'
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
  [AppRoutes.ACTIVE]: {
    path: RoutePath.active,
    element: <ActivePage />
  },
  [AppRoutes.ARCHIVE]: {
    path: RoutePath.archive,
    element: <ArchivePage />
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePath.not_found,
    element: <h1 style={{ color: "white", margin: 0 }}>Not found</h1>
  },
};