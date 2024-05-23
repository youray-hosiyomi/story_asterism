-- UNIVERSE
CREATE TABLE
  ideas (
    id UUID DEFAULT uuid_generate_v4 (),
    NAME VARCHAR(55) NOT NULL,
    detail TEXT,
    data_map JSON NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id)
  );

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

CREATE
OR REPLACE TRIGGER on_create_ideas BEFORE INSERT ON ideas FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE
OR REPLACE TRIGGER on_update_ideas BEFORE
UPDATE ON ideas FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own ideas" ON ideas FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own ideas" ON ideas FOR
SELECT
  USING (auth.uid () = created_by);

CREATE POLICY "update own ideas" ON ideas FOR
UPDATE USING (auth.uid () = created_by)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own ideas" ON ideas FOR DELETE USING (auth.uid () = created_by);