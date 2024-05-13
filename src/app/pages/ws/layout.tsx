import { UILayoutHandler } from "../../../common/ui/layout.ui";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthPageFC } from "@/common/type/page.type";
import AuthUserButton from "@/app/features/auth/_components/user-button.component";
import { useMemo, useRef } from "react";
import { wsPageLinkConfig, wsPageLinkMaps } from "@/app/config/page-link.config";
import { cn } from "@/common/utils/classname.util";
import AppTitle from "@/app/features/app-title.component";
import BaseLayout from "@/app/features/base-layout.component";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shadcn/components/ui/tooltip";

const linkMaps = wsPageLinkMaps;

const WS_Layout: AuthPageFC = ({ auth }) => {
  const handlerRef = useRef<UILayoutHandler>(null);
  const location = useLocation();
  const layoutSideMenuClass: string = useMemo(() => {
    const className = "w-full md:w-80 lg:w-16 !transition-all";
    return className;
  }, []);
  return (
    <BaseLayout
      handlerRef={handlerRef}
      header={{
        leftItems: (
          <Link to={wsPageLinkConfig["/ws"].path}>
            <AppTitle className="text-lg font-bold" />
          </Link>
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
            <div className="p-2">
              <ul className="menu bg-base-200 rounded-box">
                {linkMaps.map((l) => {
                  const isActive: boolean = l.path == location.pathname;
                  const isSubActive: boolean = l.childPathes.indexOf(location.pathname) !== -1;
                  return (
                    <Tooltip key={l.path}>
                      <TooltipTrigger>
                        <li title={l.name} className="" data-tip={l.name}>
                          <Link
                            to={l.path}
                            className={cn(
                              "lg:px-0 lg:py-2 lg:items-center lg:justify-center",
                              isActive || isSubActive ? "active" : null,
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
                      </TooltipTrigger>
                      <TooltipContent className="max-lg:hidden" side="right">
                        <p className="text-red">{l.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </ul>
            </div>
          </>
        ),
        header: <></>,
        className: layoutSideMenuClass,
      }}
    >
      <Outlet />
    </BaseLayout>
  );
};

export default WS_Layout;
