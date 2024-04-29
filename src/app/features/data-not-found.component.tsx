import { DatabaseIcon } from "lucide-react";
import { FC } from "react";

const DataNotFound: FC = () => {
  return (
    <>
      <DatabaseIcon className="h-16 w-16 stroke-1" />
      <span className="flex items-center">データが見つかりません。</span>
    </>
  );
};

export default DataNotFound;
