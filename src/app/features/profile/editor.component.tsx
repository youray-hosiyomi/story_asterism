import { Profile, profileApi } from "@/app/api/table/profile.api";
import { FC, useEffect, useState } from "react";
import { useAuthContext } from "../auth/hook";
import { Auth } from "@/app/api/auth.api";
import UIFormControl from "@/common/ui/form-control.ui";
import { useImageContext } from "../image/hook";
import { profileStorageApi } from "@/app/api/storage/profile.storage.api";
import UserAvatar from "../user/avatar.component";

const ProfileEditor: FC<{ auth: Auth }> = ({ auth }) => {
  const { refetch } = useAuthContext();
  const [req, setReq] = useState<Profile["Row"]>(auth.profile);
  const [imageUrl, setImageUrl] = useState<string | undefined>(auth.profileImage?.url);
  const upsert = profileApi.mutation.useUpsert();
  const { select } = useImageContext();
  useEffect(() => {
    setReq(auth.profile);
    setImageUrl(auth.profileImage?.url);
  }, [auth]);
  function onUpsert() {
    upsert.mutateAsync(req).then(() => {
      refetch();
    });
  }
  return (
    <form
      className="p-2"
      onSubmit={(ev) => {
        ev.preventDefault();
        onUpsert();
      }}
    >
      <div>
        <button
          type="button"
          onClick={() => {
            select({
              api: profileStorageApi,
              folderPath: auth.user.id,
              prevFileName: profileStorageApi.fileNameByProfile(req) ?? undefined,
              onSelect(image) {
                const key = profileStorageApi.avatarKeyByFile(image.file);
                setImageUrl(image.url);
                setReq({
                  ...req,
                  avatar_key: key,
                });
              },
            });
          }}
        >
          <UserAvatar
            src={imageUrl}
            className="w-64 rounded-lg bg-base-100 ring ring-base-content ring-offset-base-100 ring-offset-2"
          />
        </button>
      </div>
      <div>
        <UIFormControl labelText="ユーザ名">
          <input
            type="text"
            className="input input-bordered"
            value={req.username ?? ""}
            onChange={(ev) => {
              const username = ev.target.value;
              setReq({
                ...req,
                username,
              });
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="詳細">
          <textarea
            className="textarea textarea-bordered"
            value={req.detail ?? ""}
            onChange={(ev) => {
              const detail = ev.target.value;
              setReq({
                ...req,
                detail,
              });
            }}
          />
        </UIFormControl>
      </div>
      <div className="flex justify-end items-center">
        <button type="submit" className="btn btn-success">
          更新
        </button>
      </div>
    </form>
  );
};

export default ProfileEditor;
