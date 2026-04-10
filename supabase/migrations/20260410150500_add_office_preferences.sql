DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'office_preferences'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN office_preferences JSONB DEFAULT '{"auto_notifications": true, "due_date_alerts": true, "auto_document_sending": false, "whatsapp_connected": true, "email_connected": true}'::jsonb;
  END IF;
END $$;
