import { cn } from "@shadcn/lib/utils";
import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode, useMemo } from "react";

export type UILoadingKind = "spiner";

export interface UILoadingProps extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  kind?: UILoadingKind;
}

function getClassNameByKind(kind?: UILoadingKind): string {
  let className = "";
  if (kind == "spiner") {
    className = "loading-spinner";
  }
  return className;
}

export const UILoading: FC<UILoadingProps> = ({ className, kind, ...props }) => {
  const classNameByKind = useMemo(() => getClassNameByKind(kind), [kind]);
  return (
    <>
      <span {...props} className={cn("loading", classNameByKind, className ?? "")} />
    </>
  );
};

export const UILoadingContent: FC<UILoadingProps & { isLoading?: boolean; children?: ReactNode }> = ({
  isLoading,
  children,
  ...props
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <UILoading {...props} />
      </div>
    );
  }
  return children;
};

export const UILoadingArea: FC = () => {
  return (
    <>
      <UILoading className="loading-lg" />
      <span className="">Loading...</span>
    </>
  );
};

export const UILoadingBox: FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-52 space-x-2">
      <UILoadingArea />
    </div>
  );
};
