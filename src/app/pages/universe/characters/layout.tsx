import { characterApi } from "@/app/api/table/universe/character.api";
import { CharacterContext } from "@/app/features/universes/character/context";
import Character_MiniEditor from "@/app/features/universes/character/mini-editor.component";
import { useUniverseUnion } from "@/app/features/universes/hooks";
import { AuthPageFC } from "@/common/type/page.type";
import { useConfirm } from "@/common/ui/confirm.ui";
import { TablesInsert } from "@supabase/database.type";
import { Outlet } from "react-router-dom";

const Universe_Character_Layout: AuthPageFC = () => {
  const { universe } = useUniverseUnion();
  const { data: characters, isLoading, refetch } = characterApi.query.useList({ universe_id: universe.id });
  const { confirm } = useConfirm();
  const openMiniEditor = (initReq: TablesInsert<"characters"> = characterApi.emptyReq(universe.id)) => {
    confirm({
      RenderContent: (props) => {
        return <Character_MiniEditor initReq={initReq} onSave={props.ok} onCancel={props.cancel} />;
      },
    });
  };
  return (
    <>
      <CharacterContext.Provider value={{ characters, isLoading, refetch, openMiniEditor }}>
        <Outlet />
      </CharacterContext.Provider>
    </>
  );
};

export default Universe_Character_Layout;
