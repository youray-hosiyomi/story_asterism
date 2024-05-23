import { AuthPageFC } from "@/common/type/page.type";
import Ws_Template from "@/app/pages/ws/template";
import { PencilIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import { ideaApi } from "@/app/api/table/idea.api";
import IdeaDetail from "@/app/features/idea/detail.component";

const WS_Idea_Detail_Page: AuthPageFC = () => {
  const { idea_id } = useParams<"idea_id">();
  const { data: idea, isLoading } = ideaApi.query.useFind({ id: idea_id ?? "" });
  idea;
  isLoading;
  return (
    <Ws_Template
      className=""
      subItems={
        <>
          <button className="btn btn-success btn-sm btn-square" onClick={() => {}}>
            <PencilIcon />
          </button>
        </>
      }
    >
      <IdeaDetail />
    </Ws_Template>
  );
};

export default WS_Idea_Detail_Page;
