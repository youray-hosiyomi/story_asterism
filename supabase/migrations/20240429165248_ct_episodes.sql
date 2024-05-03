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
    seq INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id, universe_id),
    UNIQUE (seq, universe_id),
    FOREIGN KEY (universe_id) REFERENCES universes (id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

CREATE
OR REPLACE FUNCTION exist_episode_by_seq (universe_id UUID, seq INTEGER) RETURNS BOOLEAN AS $$
SELECT exists(select * FROM episodes as e where e.universe_id = universe_id AND e.seq = seq);
$$ LANGUAGE SQL STABLE;

-- UNIQUE KEY違反...
-- フロントエンド側で対応予定
-- CREATE
-- OR REPLACE FUNCTION change_episode_seq (universe_id UUID, newSeq INTEGER, oldSeq INTEGER) RETURNS void AS $$
--   update episodes SET seq = (CASE
--     WHEN seq = oldSeq THEN newSeq
--     WHEN newSeq > oldSeq AND seq > oldSeq AND seq < newSeq THEN seq - 1
--     WHEN (newSeq < oldSeq OR oldSeq IS NULL) AND seq >= newSeq AND (seq < oldSeq OR oldSeq IS NULL) THEN seq + 1
--     else seq end)
--   where episodes.universe_id = universe_id;
-- $$ LANGUAGE SQL VOLATILE;
CREATE
OR REPLACE FUNCTION set_created_episode () RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = now();
  IF auth.uid() IS NOT NULL THEN
    NEW.created_by = auth.uid();
  END IF;
  IF NEW.seq IS NULL THEN
    NEW.seq = COALESCE((select MAX(seq) + 1 FROM episodes where universe_id = NEW.universe_id), 0);
  -- ELSE
  --   IF exist_episode_by_seq(NEW.universe_id, NEW.seq) THEN
  --     PERFORM change_episode_seq(NEW.universe_id, NEW.seq, NULL);
  --   END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION set_updated_episode () RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF auth.uid() IS NOT NULL THEN
    NEW.updated_by = auth.uid();
  END IF;
  IF NEW.seq IS NULL THEN
    NEW.seq = COALESCE((select MAX(seq) + 1 FROM episodes where universe_id = NEW.universe_id), 0);
  -- ELSE
  --   IF NEW.seq != OLD.seq AND exist_episode_by_seq(NEW.universe_id, NEW.seq) THEN
  --     PERFORM change_episode_seq(NEW.universe_id, NEW.seq, OLD.seq);
  --   END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_create_episode BEFORE INSERT ON episodes FOR EACH ROW
EXECUTE PROCEDURE set_created_episode ();

CREATE TRIGGER on_update_episode BEFORE
UPDATE ON episodes FOR EACH ROW
EXECUTE PROCEDURE set_updated_episode ();

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