-- ============================================
-- Migration 010: Storage policies for new buckets
-- ============================================

-- Audio bucket policies
CREATE POLICY "Authenticated users can upload audio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'audio' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated users can update their audio"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'audio' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can read audio"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'audio');

-- Videos bucket policies
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated users can update their videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'videos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can read videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');

-- Share cards bucket policies
CREATE POLICY "Authenticated users can upload share cards"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'share-cards' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can read share cards"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'share-cards');
