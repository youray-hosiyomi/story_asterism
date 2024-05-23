import { AuthPageFC } from "@/common/type/page.type";
import Ws_Template from "@/app/pages/ws/template";
import { ideaApi } from "@/app/api/table/idea.api";
import UIList from "@/common/ui/list.ui";
import { Tables, TablesInsert } from "@supabase/database.type";
import DataNotFound from "@/app/features/data-not-found.component";
import { useConfirm } from "@/common/ui/confirm.ui";
import Idea_MiniEditor from "@/app/features/idea/mini-editor.component";
import { PlusIcon } from "lucide-react";
import { Link, generatePath } from "react-router-dom";

const WS_Ideas_Page: AuthPageFC = () => {
  const { data: ideas, isLoading } = ideaApi.query.useList({});
  const { confirm } = useConfirm();
  const openMiniEditor = (initReq: TablesInsert<"ideas"> = ideaApi.emptyReq()) => {
    confirm({
      RenderContent: (props) => {
        return <Idea_MiniEditor initReq={initReq} onSave={props.ok} onCancel={props.cancel} />;
      },
    });
  };
  return (
    <Ws_Template
      className="p-2 lg:p-3"
      subItems={
        <>
          <button
            className="btn btn-success btn-sm btn-square"
            onClick={() => {
              openMiniEditor();
            }}
          >
            <PlusIcon />
          </button>
        </>
      }
    >
      <UIList<Tables<"ideas">> list={ideas} isLoading={isLoading} emptyContent={<DataNotFound />}>
        {({ data: idea }) => {
          return (
            <Link to={generatePath("/ws/ideas/:idea_id", { idea_id: idea.id })}>
              <div className="flex min-w-0 gap-x-4 px-2 py-2 sm:px-3 items-center">
                <span className="absolute inset-x-0 -top-px bottom-0" />
                <span>{idea.name}</span>
              </div>
            </Link>
          );
        }}
      </UIList>
    </Ws_Template>
  );
};

export default WS_Ideas_Page;
