import { DatabaseIcon } from "lucide-react";
import { FC } from "react";

const DataNotFound: FC = () => {
  return (
    <>
      <DatabaseIcon className="h-16 w-16 stroke-1" />
      <span>Data Not Found</span>
    </>
  );
};

export default DataNotFound;
