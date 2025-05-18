
// js/api.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://ssadwqhfmederfnfztty.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzYWR3cWhmbWVkZXJmbmZ6dHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NjMyMTcsImV4cCI6MjA2MzAzOTIxN30.Z-NDU4KLRi2rKearr-DmUa6bSoHpSaCaciPEK1EWnaI';

export const supabase = createClient(supabaseUrl, supabaseKey);


