import { HomeIcon, LogInIcon, SettingsIcon } from "lucide-react";
import { makePageLinkMaps } from "../../common/utils/page.util";
import { AuthPageProps, GuestPageProps, PageLinkConfig, PageLinkMap } from "../../common/type/page.type";
import WS_Page from "@/app/pages/ws/page";
import Login_Page from "../pages/guest/login/page";
import WS_Settings_Page from "../pages/ws/settings/page";

export type PagePath = GuestPagePath | AuthPagePath;
export type GuestPagePath = "/login";
export type AuthPagePath = WSPagePath;
export type WSPagePath = "/ws" | "/ws/settings";

export const guestPageLinkConfig: PageLinkConfig<GuestPageProps, GuestPagePath> = {
  "/login": {
    path: "/login",
    name: "ログイン",
    page: Login_Page,
    icon: LogInIcon,
  },
};
export const wsPageLinkConfig: PageLinkConfig<AuthPageProps, WSPagePath> = {
  "/ws": {
    path: "/ws",
    name: "ホーム",
    page: WS_Page,
    icon: HomeIcon,
  },
  "/ws/settings": {
    path: "/ws/settings",
    name: "設定",
    page: WS_Settings_Page,
    icon: SettingsIcon,
  },
};

export const guestPageLinkMaps: PageLinkMap<GuestPageProps>[] = makePageLinkMaps(guestPageLinkConfig);
export const wsPageLinkMaps: PageLinkMap<AuthPageProps>[] = makePageLinkMaps(wsPageLinkConfig);
