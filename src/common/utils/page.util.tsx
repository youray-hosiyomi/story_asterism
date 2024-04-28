import { RouteObject } from "react-router-dom";
import { PageLink, PageLinkConfig, PageLinkMap } from "../type/page.type";

export function makePageLinkMaps<Props extends object>(config: PageLinkConfig<Props>): PageLinkMap<Props>[] {
  const keys = Object.keys(config);
  function makeMaps(parentPath?: string) {
    const maps: PageLinkMap<Props>[] = [];
    keys.forEach((key) => {
      const link: PageLink<Props> = config[key];
      if (link && parentPath == link.parentPath) {
        const childPathes: string[] = [];
        const childMaps = makeMaps(link.path);
        childMaps.forEach((m) => {
          childPathes.push(m.path);
          childPathes.push(...m.childPathes);
        });
        maps.push({
          ...link,
          _link: link,
          childPathes,
          children: childMaps,
        });
      }
    });
    return maps;
  }
  return makeMaps();
}

export function makeRoutes<Props extends object>(
  props: Props,
  maps: PageLinkMap<Props>[],
  parentMap?: PageLinkMap<Props>,
): RouteObject[] {
  const routes: RouteObject[] = [];
  if (parentMap) {
    routes.push({
      index: true,
      element: <parentMap.page {...props} />,
    });
  }
  routes.push(
    ...maps.map((map) => {
      const children = maps.length == 0 ? [] : makeRoutes(props, map.children, map);
      return {
        path: map.path,
        element: map.layout ? <map.layout {...props} /> : undefined,
        children,
      };
    }),
  );
  return routes;
}

export function makeBreadcrumbLinks<Props extends object = object, Path extends string = string>(
  config: PageLinkConfig<Props, Path>,
  path: Path,
  indexPath?: Path,
  replacePath?: (prevPath: string) => string,
): PageLink<Props, string>[] {
  const maps = makePageLinkMaps(config);
  function selectLink(childMaps: PageLinkMap<Props>[]): PageLink<Props, string>[] {
    const links: PageLink<Props, string>[] = [];
    const map = childMaps.find((m) => {
      const p = replacePath ? replacePath(m.path) : m.path;
      return m.path !== indexPath && path.startsWith(p);
    });
    if (map) {
      links.push(map._link);
      const p = replacePath ? replacePath(map._link.path) : map._link.path;
      if (p !== path) {
        links.push(...selectLink(map.children));
      }
    }
    return links;
  }
  return selectLink(maps);
}
