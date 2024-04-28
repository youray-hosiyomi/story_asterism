import { supabase } from "@supabase/client";
import { Session, SignInWithPasswordCredentials, User } from "@supabase/supabase-js";
import { Profile, profileApi } from "./table/profile.api";
import { StorageImage } from "@/common/utils/api.util";
import { profileStorageApi } from "./storage/profile.storage.api";

export type LoginReq = SignInWithPasswordCredentials;
export const login = async (req: LoginReq) => {
  const { data, error } = await supabase.auth.signInWithPassword(req);
  if (error) {
    throw error;
  }
  return data;
};

export const logout = async () => {
  const res = await supabase.auth.signOut();
  if (res.error) {
    throw res.error;
  }
};

export type Auth = {
  session: Session;
  user: User;
  profile: Profile["Row"];
  profileImage?: StorageImage;
};
export const getAuth = async (): Promise<Auth | null> => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  if (!session) return null;
  const user = session.user;
  const profile = await profileApi.find({ uid: user.id });
  if (!profile) return null;
  const image = await profileStorageApi.downloadImageByProfile(profile);
  return {
    session,
    user: session.user,
    profile,
    profileImage: image ?? undefined,
  };
};
