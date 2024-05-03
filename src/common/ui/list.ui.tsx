import { CSSProperties, FC, ReactNode } from "react";
import { UILoadingArea } from "./loading.ui";
import { cn } from "../utils/classname.util";

export type UIListNodeRenderProps<Data> = {
  data: Data;
};

export type UIListSelectConfig<Data> = {
  data2id: (data: Data) => string;
  selectedId: string | null | undefined;
};

type UIListProps<Data> = {
  list?: Data[] | null;
  className?: string;
  isLoading: boolean;
  children: FC<UIListNodeRenderProps<Data>>;
  emptyContent?: ReactNode;
  selectConfig?: UIListSelectConfig<Data>;
};

function UIList<Data>({
  list,
  isLoading,
  children: ListNodeRender,
  className = "bg-base-100 shadow-sm ring-1 ring-base-300 sm:rounded-xl",
  emptyContent,
  selectConfig,
}: UIListProps<Data>): ReactNode {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-52 space-x-2">
        <UILoadingArea />
      </div>
    );
  }
  return (
    <ul role="list" className={cn("divide-y divide-base-200 overflow-hidden", className)}>
      {!list?.length && emptyContent && (
        <li className="relative flex justify-center gap-x-6 px-4 py-5 hover:bg-base-200 sm:px-6">{emptyContent}</li>
      )}
      {list?.map((data, index) => {
        if (selectConfig) {
          const selected = selectConfig.data2id(data) == selectConfig.selectedId;
          return (
            <li
              key={index}
              className={cn(
                "relative flex justify-between gap-x-6 hover:bg-base-200",
                selected ? "!border !border-primary" : "",
              )}
            >
              <ListNodeRender data={data} />
            </li>
          );
        }
        return (
          <li key={index} className="relative flex justify-between gap-x-6 hover:bg-base-200">
            <ListNodeRender data={data} />
          </li>
        );
      })}
    </ul>
  );
}

export interface UIListAreaProps<Data> extends UIListProps<Data> {
  header?: ReactNode;
  footer?: ReactNode;
  height?: CSSProperties["height"];
}

export function UIListArea<Data>({ header, footer, height, className, ...props }: UIListAreaProps<Data>): ReactNode {
  return (
    <div
      className={cn(
        "flex flex-col divide-y-2 divide-base-200 overflow-hidden bg-base-100 shadow-sm ring-1 ring-base-300 sm:rounded-xl",
        className,
      )}
      style={{ height }}
    >
      {header && <div className="flex-none">{header}</div>}
      <div className="flex-auto overflow-auto">
        <UIList {...props} className="" />
      </div>
      {footer && <div className="flex-none">{footer}</div>}
    </div>
  );
}

export default UIList;
