import { FC, ReactNode } from "react";
import { cn } from "@shadcn/lib/utils";

export type UIMenuListItemDef = {
  id: string;
  content: ReactNode;
  onClick?: () => void;
  children?: UIMenuListItemDef[];
};

export interface UIMenuListProps {
  items: (UIMenuListItemDef | null)[];
  className?: string;
  level?: number;
}

export const UIMenuList: FC<UIMenuListProps> = ({ items, className, level = 0 }) => {
  return (
    <>
      <ul className={cn(level == 0 ? "menu" : "", className ?? "")}>
        {items.map((item, index) => {
          if (!item) return null;
          if (!item.children || item.children.length == 0) return <li key={index}>{item.content}</li>;
          return (
            <li key={index} onClick={item.onClick}>
              <details>{item.content}</details>
              <UIMenuList items={item.children} level={level + 1} />
            </li>
          );
        })}
      </ul>
    </>
  );
};
