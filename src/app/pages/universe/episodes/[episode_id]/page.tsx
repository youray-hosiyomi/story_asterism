import { AuthPageFC } from "@/common/type/page.type";
import Universe_Template from "../../template";
import Episode_Mini_VList from "@/app/features/universes/episode/mini-v-list.component";
import Episode_Detail from "@/app/features/universes/episode/detail.component";
// import { useLocation } from "react-router-dom";

const Universe_Episodes_Detail_Page: AuthPageFC = () => {
  // const location = useLocation();
  return (
    <Universe_Template
      className="flex divide-x divide-base-300"
      // replaceContent={(path, prevContent) => {
      //   return prevContent;
      // }}
    >
      <div className="flex-none w-52 max-md:hidden">
        <Episode_Mini_VList />
      </div>
      <div className="flex-auto p-2 md:p-3">
        <Episode_Detail />
      </div>
    </Universe_Template>
  );
};

export default Universe_Episodes_Detail_Page;
