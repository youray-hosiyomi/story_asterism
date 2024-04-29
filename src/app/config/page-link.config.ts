import { EarthIcon, HomeIcon, LogInIcon, SettingsIcon, TextIcon } from "lucide-react";
import { makePageLinkMaps } from "../../common/utils/page.util";
import { AuthPageProps, GuestPageProps, PageLinkConfig, PageLinkMap } from "../../common/type/page.type";
import WS_Page from "@/app/pages/ws/page";
import Login_Page from "../pages/guest/login/page";
import WS_Settings_Page from "../pages/ws/settings/page";
import WS_Universes_Page from "../pages/ws/universes/page";
import WS_Universes_New_Page from "../pages/ws/universes/new/page";
import Universe_Page from "../pages/universe/page";
import Universe_Detail_Page from "../pages/universe/detail/page";

export type PagePath = GuestPagePath | AuthPagePath;
export type GuestPagePath = "/login";
export type AuthPagePath = WSPagePath;
export type WSPagePath = "/ws" | "/ws/settings" | "/ws/universes" | "/ws/universes/new";
export type UniversePagePath = "/universes/:universe_id" | "/universes/:universe_id/detail";

export type UniversePageParam = "universe_id";

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
  "/ws/universes": {
    path: "/ws/universes",
    name: "ユニバース",
    page: WS_Universes_Page,
    icon: EarthIcon,
  },
  "/ws/universes/new": {
    parentPath: "/ws/universes",
    path: "/ws/universes/new",
    name: "新規",
    page: WS_Universes_New_Page,
  },
  "/ws/settings": {
    path: "/ws/settings",
    name: "設定",
    page: WS_Settings_Page,
    icon: SettingsIcon,
  },
};
export const universePageLinkConfig: PageLinkConfig<AuthPageProps, UniversePagePath> = {
  "/universes/:universe_id": {
    path: "/universes/:universe_id",
    name: "ホーム",
    page: Universe_Page,
    icon: HomeIcon,
  },
  "/universes/:universe_id/detail": {
    path: "/universes/:universe_id/detail",
    name: "詳細",
    page: Universe_Detail_Page,
    icon: TextIcon,
  },
};

export const guestPageLinkMaps: PageLinkMap<GuestPageProps>[] = makePageLinkMaps(guestPageLinkConfig);
export const wsPageLinkMaps: PageLinkMap<AuthPageProps>[] = makePageLinkMaps(wsPageLinkConfig);
export const universePageLinkMaps: PageLinkMap<AuthPageProps>[] = makePageLinkMaps(universePageLinkConfig);
