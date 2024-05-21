CREATE TABLE
  "character$orders" (
    universe_id UUID NOT NULL,
    character_id_list UUID[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (universe_id),
    FOREIGN KEY (universe_id) REFERENCES universes (id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE "character$orders" ENABLE ROW LEVEL SECURITY;

CREATE
OR REPLACE TRIGGER "on_create_character$orders" BEFORE INSERT ON "character$orders" FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE
OR REPLACE TRIGGER "on_update_character$orders" BEFORE
UPDATE ON "character$orders" FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own character$orders" ON "character$orders" FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own character$orders" ON "character$orders" FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_universe (universe_id)
  );

CREATE POLICY "update own character$orders" ON "character$orders" FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own character$orders" ON "character$orders" FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
);