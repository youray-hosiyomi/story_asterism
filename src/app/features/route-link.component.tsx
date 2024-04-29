import { PageLinkConfig } from "@/common/type/page.type";
import { FC, MouseEventHandler, ReactNode, useMemo } from "react";
import { Link, Params, generatePath } from "react-router-dom";
import {
  UniversePageParam,
  UniversePagePath,
  WSPagePath,
  universePageLinkConfig,
  wsPageLinkConfig,
} from "../config/page-link.config";

export interface BaseRouteLinkProps<Path extends string> {
  path: Path;
  className?: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
}

export interface RouteLinkProps<Props extends object, Path extends string> extends BaseRouteLinkProps<Path> {
  pageLinkConfig: PageLinkConfig<Props, Path>;
  replacePath?: (path: Path) => string;
}

function RouteLink<Props extends object = object, Path extends string = string>({
  pageLinkConfig,
  path: outerPath,
  children,
  className,
  replacePath,
}: RouteLinkProps<Props, Path>) {
  const [link, path] = useMemo(() => {
    const link = pageLinkConfig[outerPath];
    const path = replacePath ? replacePath(link.path) : link.path;
    return [link, path];
  }, [outerPath, pageLinkConfig, replacePath]);
  return (
    <Link to={path} className={className}>
      {children ?? <>{link.name}</>}
    </Link>
  );
}

export const WSRouteLink: FC<BaseRouteLinkProps<WSPagePath>> = (props) => {
  return <RouteLink pageLinkConfig={wsPageLinkConfig} {...props} />;
};

export const UniverseRouteLink: FC<BaseRouteLinkProps<UniversePagePath> & { params?: Params<UniversePageParam> }> = ({
  params,
  ...props
}) => {
  function replacePath(path: UniversePagePath) {
    return generatePath(path, {
      universe_id: params?.universe_id ?? null,
    });
  }
  return <RouteLink pageLinkConfig={universePageLinkConfig} {...props} replacePath={replacePath} />;
};

export default RouteLink;
