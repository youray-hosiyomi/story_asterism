import { DetailedHTMLProps, FC } from "react";
import { cn } from "../utils/classname.util";

interface LongTextProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const LongText: FC<LongTextProps> = ({ ...props }) => {
  return <div {...props} className={cn(props.className, "whitespace-nowrap break-words break-all text-wrap")} />;
};

export default LongText;
