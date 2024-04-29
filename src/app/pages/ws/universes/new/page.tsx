import { AuthPageFC } from "@/common/type/page.type";
import Ws_Template from "@/app/pages/ws/template";
import UniverseEditor from "@/app/features/universes/editor.component";
import { universeApi } from "@/app/api/table/universe.api";

const WS_Universes_New_Page: AuthPageFC = ({ auth }) => {
  return (
    <Ws_Template className="p-2 lg:p-3">
      <div className="lg:w-6/12">
        <UniverseEditor initReq={universeApi.emptyReq(auth.user.id)} />
      </div>
    </Ws_Template>
  );
};

export default WS_Universes_New_Page;
