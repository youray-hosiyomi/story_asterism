CREATE
OR REPLACE FUNCTION set_updated_at () RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION set_created () RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = now();
  IF auth.uid() IS NOT NULL THEN
    NEW.created_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION set_updated () RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF auth.uid() IS NOT NULL THEN
    NEW.updated_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE
  profiles (
    uid UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE,
    username TEXT UNIQUE,
    detail TEXT,
    avatar_key UUID,
    CONSTRAINT username_length CHECK (CHAR_LENGTH(username) >= 3)
  );

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR
SELECT
  USING (TRUE);

CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT
WITH
  CHECK (auth.uid () = uid);

CREATE POLICY "Users can update own profile." ON profiles FOR
UPDATE USING (auth.uid () = uid)
WITH
  CHECK (auth.uid () = uid);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
CREATE FUNCTION public.handle_new_user () RETURNS TRIGGER AS $$
begin
  insert into public.profiles (uid, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user ();

-- Set up Storage!
INSERT INTO
  STORAGE.buckets (id, NAME)
VALUES
  ('profiles', 'profiles');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
CREATE POLICY "Avatar images are protected accessible." ON STORAGE.objects FOR
SELECT
  USING (bucket_id = 'profiles');

CREATE POLICY "Users can upload an avatar." ON STORAGE.objects FOR INSERT TO authenticated
WITH
  CHECK (
    bucket_id = 'profiles'
    AND auth.uid () = CAST((STORAGE.foldername (NAME)) [1] AS UUID)
  );

CREATE POLICY "Users can update their own avatar." ON STORAGE.objects FOR
UPDATE TO authenticated USING (
  auth.uid () = OWNER
  AND auth.uid () = CAST((STORAGE.foldername (NAME)) [1] AS UUID)
)
WITH
  CHECK (bucket_id = 'profiles');

CREATE POLICY "Users can delete their own avatar." ON STORAGE.objects FOR INSERT TO authenticated
WITH
  CHECK (
    bucket_id = 'profiles'
    AND auth.uid () = OWNER
    AND auth.uid () = CAST((STORAGE.foldername (NAME)) [1] AS UUID)
  );