-- Migration: Update handle_new_user() to support OAuth signups (e.g., Google)
-- When username metadata is missing, generate one from the email prefix + random hex suffix.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _username text;
  _display_name text;
  _avatar_url text;
  _email_prefix text;
  _suffix text;
BEGIN
  -- Use provided username if available (email signup flow)
  _username := NEW.raw_user_meta_data->>'username';

  -- If no username provided (OAuth flow), generate from email
  IF _username IS NULL OR _username = '' THEN
    -- Extract email prefix, sanitize to allowed chars, truncate
    _email_prefix := split_part(NEW.email, '@', 1);
    _email_prefix := lower(regexp_replace(_email_prefix, '[^a-z0-9-]', '-', 'gi'));
    _email_prefix := regexp_replace(_email_prefix, '-+', '-', 'g');  -- collapse multiple dashes
    _email_prefix := regexp_replace(_email_prefix, '^-|-$', '', 'g');  -- trim leading/trailing dashes
    _email_prefix := left(_email_prefix, 24);  -- leave room for suffix

    -- Ensure minimum length
    IF length(_email_prefix) < 1 THEN
      _email_prefix := 'user';
    END IF;

    -- Append random 4-char hex suffix
    _suffix := substr(md5(random()::text), 1, 4);
    _username := _email_prefix || '-' || _suffix;
  END IF;

  -- Get display name from metadata (Google provides full_name)
  _display_name := COALESCE(
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    _username
  );

  -- Get avatar URL from metadata (Google provides avatar_url or picture)
  _avatar_url := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture'
  );

  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (NEW.id, _username, _display_name, _avatar_url);

  RETURN NEW;
END;
$$;
