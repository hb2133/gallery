import { createBrowserClient } from '@supabase/ssr';
import { GetSupabasePublicConfig } from '@/core/config/SupabaseConfig';

let BrowserClient: ReturnType<typeof createBrowserClient> | null = null;

export function GetSupabaseBrowserClient()
{
    if(BrowserClient)
    {
        return BrowserClient;
    }

    const Config = GetSupabasePublicConfig();

    BrowserClient = createBrowserClient(
        Config.Url,
        Config.PublishableKey,
    );

    return BrowserClient;
}
