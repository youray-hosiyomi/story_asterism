import { cn } from "@shadcn/lib/utils";
import { AlignJustify, XIcon } from "lucide-react";
import { CSSProperties, FC, ReactNode, RefObject, useImperativeHandle, useRef } from "react";

export type UILayoutSideMenuProps = {
  content: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  width?: number;
  className?: string;
  style?: CSSProperties;
};

export type UILayoutHeaderProps = {
  leftItems?: ReactNode;
  rightItems?: ReactNode;
};

export type UILayoutHandler = {
  drawerCheckRef: RefObject<HTMLInputElement>;
};

export interface UILayoutProps {
  sideMenu?: UILayoutSideMenuProps;
  header?: UILayoutHeaderProps;
  children: ReactNode;
  handlerRef?: RefObject<UILayoutHandler>;
}

const UILayout: FC<UILayoutProps> = ({ children, sideMenu, header, handlerRef }) => {
  const drawerCheckRef: RefObject<HTMLInputElement> = useRef(null);
  useImperativeHandle(
    handlerRef,
    () => {
      return {
        drawerCheckRef,
      };
    },
    [drawerCheckRef],
  );
  const content = (
    <div className="flex flex-col h-dvh">
      {header && (
        <header className="bg-base-100 text-base-content flex-none flex h-16 w-full justify-center border-b border-gray-200 duration-100">
          <nav className="navbar w-full">
            <div className="flex flex-1 md:gap-1 lg:gap-2">
              {!!sideMenu && (
                <span
                  className="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)] lg:hidden"
                  data-tip="Menu"
                >
                  <label aria-label="Open menu" htmlFor="drawer" className="btn btn-square btn-ghost drawer-button">
                    <AlignJustify className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6" />
                  </label>
                </span>
              )}
              {header.leftItems}
            </div>
            <div className="flex flex-0 md:gap-1 lg:gap-2">{header.rightItems}</div>
          </nav>
        </header>
      )}
      {children}
    </div>
  );

  if (!sideMenu) return <div className="bg-base-100 animate-fadein">{content}</div>;

  return (
    <div className="bg-base-100 drawer lg:drawer-open animate-fadein">
      <input id="drawer" type="checkbox" className="drawer-toggle" ref={drawerCheckRef} />
      <div className="drawer-content">{content}</div>
      <div className="drawer-side overflow-hidden z-40 border-r border-base-300">
        <label htmlFor="drawer" className="drawer-overlay" aria-label="Close menu"></label>
        <aside className={cn("bg-base-100 min-h-screen flex flex-col", sideMenu.className)} style={sideMenu.style}>
          {sideMenu.header && (
            <nav className="flex-none bg-base-100 w-full border border-base-300 gap-y-2 h-16 flex">
              <div className="flex-auto">{sideMenu.header}</div>
              <div className="flex-none md:hidden pr-6 flex items-center">
                <label htmlFor="drawer" className="btn btn-sm rounded-full w-8 h-8 p-0" aria-label="Close menu">
                  <XIcon className="w-6 h-6" />
                </label>
              </div>
            </nav>
          )}
          <div className="max-md:pr-6 flex-auto overflow-auto">{sideMenu.content}</div>
          {sideMenu.footer && <div className="flex-none">{sideMenu.footer}</div>}
        </aside>
      </div>
    </div>
  );
};

export default UILayout;
