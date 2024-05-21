CREATE TABLE
  "character&event$relations" (
    character_id UUID NOT NULL,
    event_id UUID NOT NULL,
    universe_id UUID NOT NULL,
    detail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (character_id, event_id, universe_id),
    FOREIGN KEY (character_id, universe_id) REFERENCES characters (id, universe_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (event_id, universe_id) REFERENCES events (id, universe_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (universe_id) REFERENCES universes (id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE "character&event$relations" ENABLE ROW LEVEL SECURITY;

CREATE
OR REPLACE TRIGGER "on_create_character&event$relation" BEFORE INSERT ON "character&event$relations" FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE
OR REPLACE TRIGGER "on_update_character&event$relation" BEFORE
UPDATE ON "character&event$relations" FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own character&event$relations" ON "character&event$relations" FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own character&event$relations" ON "character&event$relations" FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_universe (universe_id)
  );

CREATE POLICY "update own character&event$relations" ON "character&event$relations" FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own character&event$relations" ON "character&event$relations" FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
);