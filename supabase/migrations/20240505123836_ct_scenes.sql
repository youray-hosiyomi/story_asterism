CREATE TABLE
  "scenes" (
    id UUID DEFAULT uuid_generate_v4 (),
    episode_id UUID NOT NULL,
    event_id UUID,
    universe_id UUID NOT NULL,
    NAME VARCHAR(25) NOT NULL,
    detail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id, universe_id),
    FOREIGN KEY (episode_id, universe_id) REFERENCES episodes (id, universe_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (event_id, universe_id) REFERENCES events (id, universe_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (universe_id) REFERENCES universes (id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE "scenes" ENABLE ROW LEVEL SECURITY;

CREATE
OR REPLACE TRIGGER on_create_scene BEFORE INSERT ON scenes FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE
OR REPLACE TRIGGER on_update_scene BEFORE
UPDATE ON scenes FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own scenes" ON "scenes" FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own scenes" ON "scenes" FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_universe (universe_id)
  );

CREATE POLICY "update own scenes" ON "scenes" FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own scenes" ON "scenes" FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
);