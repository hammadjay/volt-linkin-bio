-- ============================================
-- Migration 012: Storage policies for bg-images bucket
-- ============================================

CREATE POLICY "Authenticated users can upload bg images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bg-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated users can update their bg images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'bg-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated users can delete their bg images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'bg-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can read bg images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'bg-images');
