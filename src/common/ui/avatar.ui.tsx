import { FC, HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/classname.util";

export interface UIAvatarProps {
  className?: string;
  src?: string;
  role?: HTMLAttributes<HTMLDivElement>["role"];
  tabIndex?: HTMLAttributes<HTMLDivElement>["tabIndex"];
  placefolder?: ReactNode;
  alt?: string;
  onErrorSrc?: string;
}

export const UIAvatar: FC<UIAvatarProps> = ({ className, src, alt, placefolder, onErrorSrc, role, tabIndex }) => {
  const isPlacefolder: boolean = !src && !!placefolder;
  return (
    <div className={cn("avatar", isPlacefolder ? "placeholder" : "")} role={role} tabIndex={tabIndex}>
      <div className={cn(className ?? "w-8 rounded")}>
        {!isPlacefolder ? (
          <img
            src={src ?? onErrorSrc}
            alt={alt}
            onError={(ev) => {
              if (onErrorSrc) ev.currentTarget.src = onErrorSrc;
            }}
          />
        ) : (
          placefolder
        )}
      </div>
    </div>
  );
};
