CREATE TABLE
  characters (
    id UUID DEFAULT uuid_generate_v4 (),
    NAME VARCHAR(25) NOT NULL,
    universe_id UUID NOT NULL,
    detail TEXT,
    back_story TEXT,
    image_key UUID, -- 画像パス("universes") ※例: "[universeId]/[imageKey]"
    seq INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id, universe_id),
    UNIQUE (seq, universe_id),
    FOREIGN KEY (universe_id) REFERENCES universes (id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

CREATE
OR REPLACE FUNCTION exist_character_by_seq (universe_id UUID, seq INTEGER) RETURNS BOOLEAN AS $$
SELECT exists(select * FROM characters as e where e.universe_id = universe_id AND e.seq = seq);
$$ LANGUAGE SQL STABLE;

CREATE
OR REPLACE FUNCTION set_created_character () RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = now();
  IF auth.uid() IS NOT NULL THEN
    NEW.created_by = auth.uid();
  END IF;
  IF NEW.seq IS NULL THEN
    NEW.seq = COALESCE((select MAX(seq) + 1 FROM characters where universe_id = NEW.universe_id), 0);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION set_updated_character () RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF auth.uid() IS NOT NULL THEN
    NEW.updated_by = auth.uid();
  END IF;
  IF NEW.seq IS NULL THEN
    NEW.seq = COALESCE((select MAX(seq) + 1 FROM characters where universe_id = NEW.universe_id), 0);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_create_character BEFORE INSERT ON characters FOR EACH ROW
EXECUTE PROCEDURE set_created_character ();

CREATE TRIGGER on_update_character BEFORE
UPDATE ON characters FOR EACH ROW
EXECUTE PROCEDURE set_updated_character ();

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