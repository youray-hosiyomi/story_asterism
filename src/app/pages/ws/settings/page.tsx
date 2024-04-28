import { AuthPageFC } from "@/common/type/page.type";
import Ws_Template from "@/app/pages/ws/template";
import ProfileEditor from "@/app/features/profile/editor.component";

const WS_Settings_Page: AuthPageFC = ({ auth }) => {
  return (
    <Ws_Template className="p-2 lg:p-3">
      <div className="lg:w-6/12">
        <ProfileEditor auth={auth} />
      </div>
    </Ws_Template>
  );
};

export default WS_Settings_Page;
