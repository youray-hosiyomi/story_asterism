import { AuthPageFC } from "@/common/type/page.type";
import Universe_Template from "../template";
import UniverseEditor from "@/app/features/universes/editor.component";
import { useUniverseUnion } from "@/app/features/universes/hooks";

const Universe_Detail_Page: AuthPageFC = () => {
  const { universe } = useUniverseUnion();
  return (
    <Universe_Template className="p-2 lg:p-3">
      <div className="lg:w-6/12">
        <UniverseEditor initReq={universe} />
      </div>
    </Universe_Template>
  );
};

export default Universe_Detail_Page;
