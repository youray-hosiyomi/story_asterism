CREATE TABLE
  periods (
    id UUID DEFAULT uuid_generate_v4 (),
    NAME VARCHAR(25) NOT NULL,
    universe_id UUID NOT NULL,
    detail TEXT,
    is_real BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id, universe_id),
    FOREIGN KEY (universe_id) REFERENCES universes (id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE periods ENABLE ROW LEVEL SECURITY;

CREATE
OR REPLACE TRIGGER on_create_period BEFORE INSERT ON periods FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE
OR REPLACE TRIGGER on_update_period BEFORE
UPDATE ON periods FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own periods" ON periods FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own periods" ON periods FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_universe (universe_id)
  );

CREATE POLICY "update own periods" ON periods FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own periods" ON periods FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
);