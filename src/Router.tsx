import { FC, useMemo } from "react";
import { Navigate, RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  guestPageLinkConfig,
  guestPageLinkMaps,
  universePageLinkConfig,
  universePageLinkMaps,
  wsPageLinkConfig,
  wsPageLinkMaps,
} from "./app/config/page-link.config";
import WS_Layout from "./app/pages/ws/layout";
import { useAuthContext } from "./app/features/auth/hook";
import { makeRoutes } from "./common/utils/page.util";
import { UILoading } from "./common/ui/loading.ui";
import Universe_Layout from "./app/pages/universe/layout";

const Router: FC = () => {
  const { auth, isLoading } = useAuthContext();
  const router = useMemo(() => {
    const routes: RouteObject[] = auth
      ? [
          {
            path: universePageLinkConfig["/universes/:universe_id"].path,
            element: <Universe_Layout auth={auth} />,
            children: makeRoutes({ auth }, universePageLinkMaps),
          },
          {
            path: wsPageLinkConfig["/ws"].path,
            element: <WS_Layout auth={auth} />,
            children: makeRoutes({ auth }, wsPageLinkMaps),
          },
          {
            path: "*",
            element: <Navigate to={wsPageLinkConfig["/ws"].path} replace />,
          },
        ]
      : [
          ...makeRoutes({}, guestPageLinkMaps),
          {
            path: "*",
            element: <Navigate to={guestPageLinkConfig["/login"].path} replace />,
          },
        ];
    return createBrowserRouter(routes);
  }, [auth]);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-52 animate-fadein-up">
        <UILoading />
      </div>
    );
  }
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default Router;
