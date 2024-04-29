import { FC, HTMLAttributes, ReactNode, useEffect, useState } from "react";
import { cn } from "../utils/classname.util";
import { UILoading } from "./loading.ui";

export interface UIAvatarProps {
  className?: string;
  src?: string;
  role?: HTMLAttributes<HTMLDivElement>["role"];
  tabIndex?: HTMLAttributes<HTMLDivElement>["tabIndex"];
  placefolder?: ReactNode;
  alt?: string;
  onErrorSrc?: string;
  getSrc?: () => Promise<string | undefined>;
}

export const UIAvatar: FC<UIAvatarProps> = ({
  className,
  src: outerSrc,
  alt,
  placefolder,
  onErrorSrc,
  role,
  tabIndex,
  getSrc,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [src, setSrc] = useState<string | undefined>(outerSrc);
  const isPlacefolder: boolean = !src && !!placefolder;
  useEffect(() => {
    if ((!outerSrc || outerSrc.length == 0) && getSrc) {
      setIsLoading(true);
      getSrc()
        .then((newSrc) => {
          setSrc(newSrc);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setSrc(outerSrc);
    }
  }, [outerSrc, getSrc]);
  return (
    <div className={cn("avatar", isLoading || isPlacefolder ? "placeholder" : "")} role={role} tabIndex={tabIndex}>
      {isLoading ? (
        <>
          <div className={cn(className ?? "w-8 rounded")}>
            <UILoading />
          </div>
        </>
      ) : (
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
      )}
    </div>
  );
};
