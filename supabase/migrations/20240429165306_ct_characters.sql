CREATE TABLE
  characters (
    id UUID DEFAULT uuid_generate_v4 (),
    NAME VARCHAR(25) NOT NULL,
    universe_id UUID NOT NULL,
    detail TEXT,
    image_key UUID, -- 画像パス("universes") ※例: "[universeId]/[imageKey]"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id, universe_id),
    FOREIGN KEY (universe_id) REFERENCES universes (id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER on_create_character BEFORE INSERT ON characters FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE TRIGGER on_update_character BEFORE
UPDATE ON characters FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own characters" ON characters FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own characters" ON characters FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_universe (universe_id)
  );

CREATE POLICY "update own characters" ON characters FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own characters" ON characters FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
);