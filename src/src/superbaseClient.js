import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'hqdzfimtdxnadffpmyij'
const supabaseAnonKey = 'MartBri0908'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)