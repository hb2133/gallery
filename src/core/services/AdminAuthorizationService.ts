import type { User } from '@supabase/supabase-js';
import { CreateSupabaseServerClient } from '@/core/infra/supabase/SupabaseServerClient';

export async function GetVerifiedAdminUser(): Promise<User | null>
{
    const Supabase = await CreateSupabaseServerClient();
    const { data, error } = await Supabase.auth.getUser();

    if(error || data.user.app_metadata.role !== 'admin')
    {
        return null;
    }

    return data.user;
}
