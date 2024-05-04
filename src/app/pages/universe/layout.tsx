import { UILayoutHandler } from "../../../common/ui/layout.ui";
import { Link, Navigate, Outlet, generatePath, useLocation, useParams } from "react-router-dom";
import { AuthPageFC } from "@/common/type/page.type";
import AuthUserButton from "@/app/features/auth/_components/user-button.component";
import { useMemo, useRef } from "react";
import { UniversePageParam, universePageLinkMaps, wsPageLinkConfig } from "@/app/config/page-link.config";
import { cn } from "@/common/utils/classname.util";
import BaseLayout from "@/app/features/base-layout.component";
import { useGetUniverseUnion } from "@/app/features/universes/hooks";
import { UILoadingBox } from "@/common/ui/loading.ui";
import { UniverseContext } from "@/app/features/universes/context";
import { LogOutIcon } from "lucide-react";
import { UniverseRouteLink, WSRouteLink } from "@/app/features/route-link.component";
import { UniverseImg } from "@/app/features/universes/img.component";

const linkMaps = universePageLinkMaps;

const Universe_Layout: AuthPageFC = ({ auth }) => {
  const params = useParams<UniversePageParam>();
  const { data: universeUnion, isLoading, refetch } = useGetUniverseUnion(params.universe_id ?? "");
  const handlerRef = useRef<UILayoutHandler>(null);
  const location = useLocation();
  const layoutSideMenuClass: string = useMemo(() => {
    const className = "w-full md:w-80 lg:w-16 !transition-all";
    return className;
  }, []);
  if (isLoading) {
    return <UILoadingBox />;
  }
  if (!universeUnion) {
    return <Navigate to={wsPageLinkConfig["/ws/universes"].path} replace={true} />;
  }
  return (
    <UniverseContext.Provider value={{ universeUnion, universeId: universeUnion.universe.id, isLoading, refetch }}>
      <BaseLayout
        handlerRef={handlerRef}
        header={{
          leftItems: (
            <UniverseRouteLink
              path="/universes/:universe_id"
              universe_id={params.universe_id}
              character_id={params.character_id}
              className="flex items-center space-x-2"
            >
              {universeUnion.universe.image_key && (
                <UniverseImg
                  universe_id={universeUnion.universe.id}
                  image_key={universeUnion.universe.image_key}
                  className="w-7 rounded-lg bg-base-100"
                />
              )}
              <h1 className="text-lg font-bold whitespace-nowrap text-ellipsis overflow-hidden">
                {universeUnion.universe.name}
              </h1>
            </UniverseRouteLink>
          ),
          rightItems: (
            <>
              <AuthUserButton auth={auth} />
            </>
          ),
        }}
        sideMenu={{
          content: (
            <>
              <div className="p-2 h-full">
                <ul className="menu bg-base-200 rounded-box">
                  {linkMaps.map((l) => {
                    const path = generatePath(l.path, params);
                    const isActive: boolean = path == location.pathname;
                    return (
                      <li key={path} title={l.name} className="" data-tip={l.name}>
                        <Link
                          to={path}
                          className={cn(
                            "lg:px-0 lg:py-2 lg:items-center lg:justify-center",
                            isActive ? "active" : null,
                          )}
                          onClick={(ev) => {
                            ev;
                            if (handlerRef.current?.drawerCheckRef.current) {
                              handlerRef.current.drawerCheckRef.current.checked = false;
                            }
                          }}
                        >
                          {l.icon && <l.icon className="w-5 h-5" />}
                          <span className="lg:hidden">{l.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          ),
          header: <></>,
          footer: (
            <div className="border-t border-base-300 h-12 flex items-center justify-center">
              <WSRouteLink path="/ws/universes">
                <button className="btn btn-sm btn-square">
                  <LogOutIcon />
                </button>
              </WSRouteLink>
            </div>
          ),
          className: layoutSideMenuClass,
        }}
      >
        <Outlet />
      </BaseLayout>
    </UniverseContext.Provider>
  );
};

export default Universe_Layout;
