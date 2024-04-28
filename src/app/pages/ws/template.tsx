import UIPage, { UIPageProps } from "@/common/ui/page.ui";
import { FC, ReactNode, useMemo } from "react";
import { makeBreadcrumbLinks } from "@/common/utils/page.util";
import { useLocation } from "react-router-dom";
import { wsPageLinkConfig } from "../../config/page-link.config";
import UIBreadcrumb from "@/common/ui/breadcrumbs.ui";

const Ws_Template: FC<UIPageProps & { subItems?: ReactNode }> = ({ header: outerHeader, subItems, ...props }) => {
  const location = useLocation();
  const breadcrumbsLinks = useMemo(
    () => makeBreadcrumbLinks(wsPageLinkConfig, location.pathname, "/ws"),
    [location.pathname],
  );
  const header = useMemo(() => {
    const links = breadcrumbsLinks;
    if (links.length !== 0) {
      return (
        <div className="space-y-2 p-2">
          <div className="flex items-center justify-between">
            <UIBreadcrumb firstItem={wsPageLinkConfig["/ws"]} items={links} />
            <div className="flex items-center space-x-2">{subItems}</div>
          </div>
          {outerHeader}
        </div>
      );
    }
    return outerHeader;
  }, [outerHeader, breadcrumbsLinks, subItems]);
  return <UIPage {...props} header={header} />;
};

export default Ws_Template;
