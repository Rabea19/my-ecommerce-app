import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wqeivrzzbcydowwpbxkg.supabase.co";
const supabaseKey = "sb_publishable__n8jGr280QlAtbjW4VyFKA_5VWx4ggB";

export const supabase = createClient(supabaseUrl, supabaseKey);
