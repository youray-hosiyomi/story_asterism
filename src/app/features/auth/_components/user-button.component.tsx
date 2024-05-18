import { useLogout } from "@/app/features/auth/hook";
import { Auth } from "@/app/api/auth.api";
import { FC } from "react";
import { Link } from "react-router-dom";
import UserAvatar from "../../user/avatar.component";
import { UIMenuList } from "@/common/ui/menu-list.ui";
import { wsPageLinkConfig } from "@/app/config/page-link.config";

interface AuthUserButtonProps {
  auth: Auth;
  contentZIndex?: number;
}

const AuthUserButton: FC<AuthUserButtonProps> = ({ auth: { profile, profileImage, user }, contentZIndex }) => {
  const logout = useLogout();
  return (
    <>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <UserAvatar
            className="w-10 rounded-full bg-base-100 ring-2 ring-base-content ring-offset-base-100 ring-offset-2"
            src={profileImage?.url}
          />
        </div>
        <div
          tabIndex={0}
          className="dropdown-content bg-base-100 w-60 rounded-md shadow-md outline outline-1 outline-gray-200 z-[1]"
          style={{ zIndex: contentZIndex }}
        >
          <div className="p-1">
            <Link to={wsPageLinkConfig["/ws/settings"].path} className="w-full block space-y-2 hover:bg-base-200 py-2">
              <div className="flex items-center justify-center w-full px-4">
                <UserAvatar src={profileImage?.url} className="w-full rounded-lg bg-base-100" />
              </div>
              <div className="text-center mx-3 font-semibold">{profile?.username}</div>
              <div className="text-center text-xs">{user.email}</div>
            </Link>
          </div>
          <hr className="" />
          <UIMenuList
            className=""
            items={[
              {
                id: "logout",
                content: (
                  <a
                    href={""}
                    onClick={(ev) => {
                      ev.preventDefault();
                      logout.mutateAsync();
                    }}
                  >
                    ログアウト
                  </a>
                ),
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default AuthUserButton;
