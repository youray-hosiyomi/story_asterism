import { AuthPageFC } from "@/common/type/page.type";
import Episode_Detail from "@/app/features/universes/episode/detail.component";

const Universe_Episodes_Detail_Page: AuthPageFC = () => {
  return (
    <div className=" p-2 md:p-3">
      <Episode_Detail />
    </div>
  );
};

export default Universe_Episodes_Detail_Page;
