CREATE TABLE
  events (
    id UUID DEFAULT uuid_generate_v4 (),
    NAME VARCHAR(25) NOT NULL,
    universe_id UUID NOT NULL,
    period_id UUID NOT NULL,
    detail TEXT,
    YEAR INTEGER NOT NULL DEFAULT 0,
    MONTH INTEGER NOT NULL DEFAULT 0,
    date INTEGER NOT NULL DEFAULT 0,
    HOUR INTEGER NOT NULL DEFAULT 0,
    MINUTE INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id, universe_id),
    FOREIGN KEY (period_id, universe_id) REFERENCES periods (id, universe_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (universe_id) REFERENCES universes (id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE
OR REPLACE TRIGGER on_create_event BEFORE INSERT ON events FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE
OR REPLACE TRIGGER on_update_event BEFORE
UPDATE ON events FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own events" ON events FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own events" ON events FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_universe (universe_id)
  );

CREATE POLICY "update own events" ON events FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own events" ON events FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
);