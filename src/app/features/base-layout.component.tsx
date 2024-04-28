import { UIConfirm_Provider } from "@/common/ui/confirm.ui";
import UILayout, { UILayoutProps } from "@/common/ui/layout.ui";
import { FC } from "react";
import { ImageProvider } from "./image/provider";

const BaseLayout: FC<UILayoutProps> = (props) => {
  return (
    <>
      <UIConfirm_Provider>
        <ImageProvider>
          <UILayout {...props} />
        </ImageProvider>
      </UIConfirm_Provider>
    </>
  );
};

export default BaseLayout;
