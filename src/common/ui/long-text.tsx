import { DetailedHTMLProps, FC } from "react";
import { cn } from "@shadcn/lib/utils";

interface UILongTextProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const UILongText: FC<UILongTextProps> = ({ ...props }) => {
  return <div {...props} className={cn(props.className, "whitespace-pre-wrap break-words break-all text-wrap")} />;
};

export default UILongText;
