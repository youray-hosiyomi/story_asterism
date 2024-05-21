CREATE TABLE
  "period$orders" (
    universe_id UUID NOT NULL,
    period_id_list UUID[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (universe_id),
    FOREIGN KEY (universe_id) REFERENCES universes (id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE "period$orders" ENABLE ROW LEVEL SECURITY;

CREATE
OR REPLACE TRIGGER "on_create_period$orders" BEFORE INSERT ON "period$orders" FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE
OR REPLACE TRIGGER "on_update_period$orders" BEFORE
UPDATE ON "period$orders" FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own period$orders" ON "period$orders" FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own period$orders" ON "period$orders" FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_universe (universe_id)
  );

CREATE POLICY "update own period$orders" ON "period$orders" FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own period$orders" ON "period$orders" FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
);