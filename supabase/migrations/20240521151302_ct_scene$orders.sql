CREATE TABLE
  "scene$orders" (
    universe_id UUID NOT NULL,
    episode_id UUID NOT NULL,
    scene_id_list UUID[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (episode_id, universe_id),
    FOREIGN KEY (universe_id) REFERENCES universes (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (episode_id, universe_id) REFERENCES episodes (id, universe_id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE "scene$orders" ENABLE ROW LEVEL SECURITY;

CREATE
OR REPLACE TRIGGER "on_create_scene$orders" BEFORE INSERT ON "scene$orders" FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE
OR REPLACE TRIGGER "on_update_scene$orders" BEFORE
UPDATE ON "scene$orders" FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own scene$orders" ON "scene$orders" FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own scene$orders" ON "scene$orders" FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_universe (universe_id)
  );

CREATE POLICY "update own scene$orders" ON "scene$orders" FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own scene$orders" ON "scene$orders" FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
);