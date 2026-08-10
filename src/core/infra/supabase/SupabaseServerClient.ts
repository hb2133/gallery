import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { GetSupabasePublicConfig } from '@/core/config/SupabaseConfig';

export async function CreateSupabaseServerClient()
{
    const CookieStore = await cookies();
    const Config = GetSupabasePublicConfig();

    return createServerClient(
        Config.Url,
        Config.PublishableKey,
        {
            cookies: {
                getAll()
                {
                    return CookieStore.getAll();
                },
                setAll(CookiesToSet)
                {
                    try
                    {
                        CookiesToSet.forEach((Cookie) =>
                        {
                            CookieStore.set(
                                Cookie.name,
                                Cookie.value,
                                Cookie.options,
                            );
                        });
                    }
                    catch
                    {
                        // Server Components cannot write cookies.
                        // The root proxy refreshes and persists the session.
                    }
                },
            },
        },
    );
}
