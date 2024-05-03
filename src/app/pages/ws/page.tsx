import { AuthPageFC } from "@/common/type/page.type";
import Ws_Template from "@/app/pages/ws/template";
import { UIListArea } from "@/common/ui/list.ui";
import { Tables } from "@supabase/database.type";
import { universeApi } from "@/app/api/table/universe/universe.api";
import DataNotFound from "@/app/features/data-not-found.component";
import { UniverseImg } from "@/app/features/universes/img.component";
import { PlusIcon } from "lucide-react";
import { UniverseRouteLink, WSRouteLink } from "@/app/features/route-link.component";

const WS_Page: AuthPageFC = () => {
  const { data: universes, isLoading } = universeApi.query.useList({ limit: 7 });
  return (
    <Ws_Template className="p-2 lg:p-3">
      <UIListArea<Tables<"universes">>
        list={universes}
        isLoading={isLoading}
        emptyContent={<DataNotFound />}
        header={
          <div className="navbar">
            <div className="navbar-start">
              <div>最近更新したユニバース一覧</div>
            </div>
            <div className="navbar-end">
              <WSRouteLink path="/ws/universes/new">
                <button className="btn btn-success btn-sm btn-square">
                  <PlusIcon />
                </button>
              </WSRouteLink>
            </div>
          </div>
        }
      >
        {({ data: universe }) => {
          return (
            <>
              <div className="flex min-w-0 gap-x-4 px-2 py-2 sm:px-3 items-center">
                <UniverseImg universe={universe} className="h-12 w-12 flex-none rounded-full bg-gray-50" alt="" />
                <div className="min-w-0 flex-auto">
                  <UniverseRouteLink path={"/universes/:universe_id"} universe_id={universe.id}>
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      <span className="absolute inset-x-0 -top-px bottom-0" />
                      {universe.name}
                    </p>
                  </UniverseRouteLink>

                  <p className="mt-1 flex text-xs leading-5 text-gray-500">
                    <span className="relative truncate hover:underline whitespace-nowrap overflow-hidden text-ellipsis">
                      {universe.detail}
                    </span>
                  </p>
                </div>
              </div>
            </>
          );
        }}
      </UIListArea>
    </Ws_Template>
  );
};

export default WS_Page;
