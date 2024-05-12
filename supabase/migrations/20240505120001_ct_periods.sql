CREATE TABLE
  periods (
    id UUID DEFAULT uuid_generate_v4 (),
    NAME VARCHAR(25) NOT NULL,
    universe_id UUID NOT NULL,
    detail TEXT,
    is_real BOOLEAN,
    seq INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id, universe_id),
    UNIQUE (seq, universe_id),
    FOREIGN KEY (universe_id) REFERENCES universes (id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE periods ENABLE ROW LEVEL SECURITY;

CREATE
OR REPLACE FUNCTION exist_period_by_seq (universe_id UUID, seq INTEGER) RETURNS BOOLEAN AS $$
SELECT exists(select * FROM periods as e where e.universe_id = universe_id AND e.seq = seq);
$$ LANGUAGE SQL STABLE;

CREATE
OR REPLACE FUNCTION set_created_period () RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = now();
  IF auth.uid() IS NOT NULL THEN
    NEW.created_by = auth.uid();
  END IF;
  IF NEW.seq IS NULL THEN
    NEW.seq = COALESCE((select MAX(seq) + 1 FROM periods where universe_id = NEW.universe_id), 0);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION set_updated_period () RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF auth.uid() IS NOT NULL THEN
    NEW.updated_by = auth.uid();
  END IF;
  IF NEW.seq IS NULL THEN
    NEW.seq = COALESCE((select MAX(seq) + 1 FROM periods where universe_id = NEW.universe_id), 0);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_create_period BEFORE INSERT ON periods FOR EACH ROW
EXECUTE PROCEDURE set_created_period ();

CREATE TRIGGER on_update_period BEFORE
UPDATE ON periods FOR EACH ROW
EXECUTE PROCEDURE set_updated_period ();

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