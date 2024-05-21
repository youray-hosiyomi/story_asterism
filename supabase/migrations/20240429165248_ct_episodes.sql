CREATE TABLE
  episodes (
    id UUID DEFAULT uuid_generate_v4 (),
    title VARCHAR(25) NOT NULL,
    universe_id UUID NOT NULL,
    summary TEXT,
    CONTENT TEXT,
    part_1 TEXT,
    part_2 TEXT,
    part_3 TEXT,
    part_4 TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id, universe_id),
    FOREIGN KEY (universe_id) REFERENCES universes (id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

CREATE
OR REPLACE TRIGGER on_create_episode BEFORE INSERT ON episodes FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE
OR REPLACE TRIGGER on_update_episode BEFORE
UPDATE ON episodes FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own episodes" ON episodes FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own episodes" ON episodes FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_universe (universe_id)
  );

CREATE POLICY "update own episodes" ON episodes FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own episodes" ON episodes FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
);