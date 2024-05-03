import { AuthPageFC } from "@/common/type/page.type";
import Universe_Template from "../../template";
import Character_Mini_VList from "@/app/features/universes/character/mini-v-list.component";
import Character_Detail from "@/app/features/universes/character/detail.component";

const Universe_Characters_Detail_Page: AuthPageFC = () => {
  return (
    <Universe_Template className="flex divide-x divide-base-300">
      <div className="flex-none w-52 max-md:hidden">
        <Character_Mini_VList />
      </div>
      <div className="flex-auto p-2 md:p-3">
        <Character_Detail />
      </div>
    </Universe_Template>
  );
};

export default Universe_Characters_Detail_Page;
