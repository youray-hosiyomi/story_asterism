import { FC, HTMLAttributes, ReactNode } from "react";
import { cn } from "@shadcn/lib/utils";
import { UILoading } from "./loading.ui";
import { useQ } from "../utils/api.util";

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

export interface UILoadingAvatarProps extends UIAvatarProps {
  getSrc: () => Promise<string | null>;
  getKey: string;
}

export const UILoadingAvatar: FC<UILoadingAvatarProps> = ({
  className,
  src: outerSrc,
  placefolder,
  getSrc,
  getKey: key,
  ...props
}) => {
  const { data: imageSrc, isLoading } = useQ(key, {}, getSrc);
  const src = outerSrc ?? imageSrc ?? undefined;
  return (
    <UIAvatar
      {...props}
      className={className}
      src={src}
      placefolder={
        isLoading ? (
          <div className={cn(className ?? "w-8 rounded")}>
            <UILoading />
          </div>
        ) : (
          placefolder
        )
      }
    />
  );
};
