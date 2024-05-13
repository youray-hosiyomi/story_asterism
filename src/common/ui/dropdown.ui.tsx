import { LucideIcon, MoreVerticalIcon } from "lucide-react";
import { FC, MouseEventHandler, ReactNode } from "react";
import { cn } from "@shadcn/lib/utils";
import { Link } from "react-router-dom";

export type UIDropdownItem = {
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  content?: ReactNode;
  icon?: LucideIcon;
};

interface UIDropdownProps {
  id?: string;
  className?: string;
  items?: UIDropdownItem[];
  children?: ReactNode;
  zIndex?: number;
  position?: "absolute" | "relative" | "sticky";
}

const UIDropdown: FC<UIDropdownProps> = ({ id, className, children, items, zIndex, position }) => {
  return (
    <>
      <div
        className="dropdown dropdown-bottom dropdown-end"
        style={{ position, zIndex: position !== "relative" ? zIndex : undefined }}
      >
        <div tabIndex={0} role="button" className={cn("btn", className)} id={id}>
          {children ?? <MoreVerticalIcon className="h-4 w-4" />}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow z-30 bg-base-100 rounded-box w-52"
          style={{ zIndex }}
        >
          {items?.map((item, i) => {
            return (
              <li key={i} className="">
                <Link
                  to={item.href ?? ""}
                  className="flex items-center space-x-2"
                  onClick={(ev) => {
                    if (!item.href) {
                      ev.preventDefault();
                    }
                    if (item.onClick) item.onClick(ev);
                  }}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.content}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default UIDropdown;
