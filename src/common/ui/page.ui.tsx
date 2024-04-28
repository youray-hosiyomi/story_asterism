import { FC, ReactNode } from "react";
import { cn } from "../utils/classname.util";

export interface UIPageProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
}

const UIPage: FC<UIPageProps> = ({ footer, header, className, ...props }) => {
  return (
    <>
      {header ? (
        <>
          <div className="flex-none bg-base-200 shadow-md border-b border-gray-200">{header}</div>
        </>
      ) : null}
      <main {...props} className={cn(className, "flex-auto overflow-auto")} />
      {footer ? (
        <>
          <div className="flex-none bg-base-200 shadow-md border-t border-gray-200">{footer}</div>
        </>
      ) : null}
    </>
  );
};

export default UIPage;
