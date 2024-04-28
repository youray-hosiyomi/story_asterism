import { wsPageLinkConfig } from "@/app/config/page-link.config";
import { AuthPageFC } from "@/common/type/page.type";
import Ws_Template from "@/app/pages/ws/template";

const WS_Page: AuthPageFC = () => {
  return (
    <Ws_Template className="p-2 lg:p-3">
      <div className="text-red-500 h-[200vh]">{wsPageLinkConfig["/ws"].name}</div>
    </Ws_Template>
  );
};

export default WS_Page;
