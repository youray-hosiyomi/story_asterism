import { AuthPageFC } from "@/common/type/page.type";
import Character_Detail from "@/app/features/universes/character/detail.component";

const Universe_Characters_Detail_Page: AuthPageFC = () => {
  return (
    <div className="p-2 md:p-3">
      <Character_Detail />
    </div>
  );
};

export default Universe_Characters_Detail_Page;
