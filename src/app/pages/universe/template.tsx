import UIPage, { UIPageProps } from "@/common/ui/page.ui";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { makeBreadcrumbLinks } from "@/common/utils/page.util";
import { generatePath, useLocation, useParams } from "react-router-dom";
import { UniversePageParam, universePageLinkConfig } from "../../config/page-link.config";
import UIBreadcrumb from "@/common/ui/breadcrumbs.ui";

const Universe_Template: FC<
  UIPageProps & { subItems?: ReactNode; replaceContent?: (path: string, prevContent: ReactNode) => ReactNode }
> = ({ header: outerHeader, subItems, replaceContent, ...props }) => {
  const params = useParams<UniversePageParam>();
  const location = useLocation();
  const replacePath = useCallback(
    (prevPath: string): string => {
      return generatePath(prevPath, params);
    },
    [params],
  );
  const breadcrumbsLinks = useMemo(
    () => makeBreadcrumbLinks(universePageLinkConfig, location.pathname, "/universes/:universe_id", replacePath),
    [location.pathname, replacePath],
  );
  const header = useMemo(() => {
    const links = breadcrumbsLinks;
    if (links.length !== 0) {
      return (
        <div className="space-y-2 p-2">
          <div className="flex items-center justify-between">
            <UIBreadcrumb
              firstItem={universePageLinkConfig["/universes/:universe_id"]}
              items={links}
              replacePath={replacePath}
              replaceContent={replaceContent}
            />
            <div className="flex items-center space-x-2">{subItems}</div>
          </div>
          {outerHeader}
        </div>
      );
    }
    return outerHeader;
  }, [breadcrumbsLinks, outerHeader, replaceContent, replacePath, subItems]);
  return <UIPage {...props} header={header} />;
};

export default Universe_Template;
