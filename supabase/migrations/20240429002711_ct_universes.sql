-- UNIVERSE
CREATE TABLE
  universes (
    id UUID DEFAULT uuid_generate_v4 (),
    owner_id UUID REFERENCES auth.users ON DELETE SET NULL, -- ユーザ
    NAME VARCHAR(55) NOT NULL,
    detail TEXT,
    image_key UUID, -- 画像パス("universes") ※例: "[universeId]/[imageKey]"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by UUID REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id)
  );

ALTER TABLE universes ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER on_create_universes BEFORE INSERT ON universes FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE TRIGGER on_update_universes BEFORE
UPDATE ON universes FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own universes" ON universes FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own universes" ON universes FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth.uid () = owner_id
  );

CREATE POLICY "update own universes" ON universes FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth.uid () = owner_id
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own universes" ON universes FOR DELETE USING (
  auth.uid () = created_by
  OR auth.uid () = owner_id
);

CREATE FUNCTION auth_check_universe (universe_id UUID) RETURNS BOOLEAN AS $$
  SELECT
    EXISTS(
      SELECT
        1
      FROM
        universes r
      WHERE
        r.id = universe_id
      AND
        (r.created_by = auth.uid() OR auth.uid () = r.owner_id));
$$ LANGUAGE SQL STABLE;

-- storage
INSERT INTO
  STORAGE.buckets (id, NAME)
VALUES
  ('universes', 'universes');

CREATE POLICY "universe images are protected" ON STORAGE.objects FOR
SELECT
  TO authenticated USING (
    bucket_id = 'universes'
    AND auth_check_universe (CAST((STORAGE.foldername (NAME)) [1] AS UUID))
  );

CREATE POLICY "universe user can upload an universe." ON STORAGE.objects FOR INSERT TO authenticated
-- WITH CHECK (bucket_id = 'universes');
WITH
  CHECK (
    bucket_id = 'universes'
    AND auth_check_universe (CAST((STORAGE.foldername (NAME)) [1] AS UUID))
  );

CREATE POLICY "universe user can update their own universe." ON STORAGE.objects FOR
UPDATE TO authenticated
-- USING (auth.uid() = OWNER)
USING (bucket_id = 'universes')
WITH
  CHECK (auth_check_universe (CAST((STORAGE.foldername (NAME)) [1] AS UUID)));

CREATE POLICY "universe user can delete their own universe." ON STORAGE.objects FOR DELETE TO authenticated
-- USING (bucket_id = 'universes');
USING (
  bucket_id = 'universes'
  AND auth_check_universe (CAST((STORAGE.foldername (NAME)) [1] AS UUID))
);