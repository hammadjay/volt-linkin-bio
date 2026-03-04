-- Add scheduling and embed columns to links table
ALTER TABLE links
  ADD COLUMN scheduled_start timestamptz NULL,
  ADD COLUMN scheduled_end timestamptz NULL,
  ADD COLUMN type text NOT NULL DEFAULT 'link',
  ADD COLUMN embed_platform text NULL;

-- Constraints
ALTER TABLE links
  ADD CONSTRAINT links_scheduled_end_after_start
    CHECK (scheduled_end IS NULL OR scheduled_start IS NULL OR scheduled_end > scheduled_start),
  ADD CONSTRAINT links_type_check
    CHECK (type IN ('link', 'embed')),
  ADD CONSTRAINT links_embed_platform_required
    CHECK (
      (type = 'embed' AND embed_platform IS NOT NULL) OR
      (type = 'link' AND embed_platform IS NULL)
    );
