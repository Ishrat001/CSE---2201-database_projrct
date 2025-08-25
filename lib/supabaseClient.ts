import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://mwlveoxareldgagpqlie.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bHZlb3hhcmVsZGdhZ3BxbGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMTU5NjYsImV4cCI6MjA2Njc5MTk2Nn0.FSAcGwBRoVUwidICK8DXcb5CY9npSAejEo4tVe9iRpo"
);

