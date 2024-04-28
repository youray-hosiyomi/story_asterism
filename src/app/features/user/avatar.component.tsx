import { UIAvatar, UIAvatarProps } from "@/common/ui/avatar.ui";
import { FC } from "react";

const UserAvatar: FC<UIAvatarProps> = ({ ...props }) => {
  return (
    <>
      <UIAvatar {...props} onErrorSrc="/assets/svg/user.svg" />
    </>
  );
};

export default UserAvatar;
