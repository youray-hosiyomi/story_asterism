CREATE TABLE
  "scenes" (
    id UUID DEFAULT uuid_generate_v4 (),
    episode_id UUID NOT NULL,
    event_id UUID NOT NULL,
    universe_id UUID NOT NULL,
    detail TEXT,
    seq INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id, universe_id),
    FOREIGN KEY (episode_id, universe_id) REFERENCES episodes (id, universe_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (event_id, universe_id) REFERENCES events (id, universe_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (universe_id) REFERENCES universes (id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE "scenes" ENABLE ROW LEVEL SECURITY;

CREATE
OR REPLACE FUNCTION exist_scene_by_seq (universe_id UUID, seq INTEGER) RETURNS BOOLEAN AS $$
SELECT exists(select * FROM scenes as e where e.universe_id = universe_id AND e.seq = seq);
$$ LANGUAGE SQL STABLE;

CREATE
OR REPLACE FUNCTION set_created_scene () RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = now();
  IF auth.uid() IS NOT NULL THEN
    NEW.created_by = auth.uid();
  END IF;
  IF NEW.seq IS NULL THEN
    NEW.seq = COALESCE((select MAX(seq) + 1 FROM scenes where universe_id = NEW.universe_id), 0);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION set_updated_scene () RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF auth.uid() IS NOT NULL THEN
    NEW.updated_by = auth.uid();
  END IF;
  IF NEW.seq IS NULL THEN
    NEW.seq = COALESCE((select MAX(seq) + 1 FROM scenes where universe_id = NEW.universe_id), 0);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_create_scene BEFORE INSERT ON scenes FOR EACH ROW
EXECUTE PROCEDURE set_created_scene ();

CREATE TRIGGER on_update_scene BEFORE
UPDATE ON scenes FOR EACH ROW
EXECUTE PROCEDURE set_updated_scene ();

CREATE POLICY "insert own scenes" ON "scenes" FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own scenes" ON "scenes" FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_universe (universe_id)
  );

CREATE POLICY "update own scenes" ON "scenes" FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own scenes" ON "scenes" FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_universe (universe_id)
);