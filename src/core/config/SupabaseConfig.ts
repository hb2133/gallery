export interface SupabasePublicConfig
{
    Url: string;
    PublishableKey: string;
}

export function GetSupabasePublicConfig(): SupabasePublicConfig
{
    const Url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const PublishableKey =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if(!Url || !PublishableKey)
    {
        throw new Error(
            'Supabase public environment variables are not configured.',
        );
    }

    return {
        Url,
        PublishableKey,
    };
}
