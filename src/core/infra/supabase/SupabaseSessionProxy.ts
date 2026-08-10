import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { GetSupabasePublicConfig } from '@/core/config/SupabaseConfig';

export async function UpdateSupabaseSession(Request: NextRequest)
{
    let Response = NextResponse.next({
        request: Request,
    });
    const Config = GetSupabasePublicConfig();
    const Supabase = createServerClient(
        Config.Url,
        Config.PublishableKey,
        {
            cookies: {
                getAll()
                {
                    return Request.cookies.getAll();
                },
                setAll(CookiesToSet)
                {
                    CookiesToSet.forEach((Cookie) =>
                    {
                        Request.cookies.set(
                            Cookie.name,
                            Cookie.value,
                        );
                    });
                    Response = NextResponse.next({
                        request: Request,
                    });
                    CookiesToSet.forEach((Cookie) =>
                    {
                        Response.cookies.set(
                            Cookie.name,
                            Cookie.value,
                            Cookie.options,
                        );
                    });
                },
            },
        },
    );

    await Supabase.auth.getClaims();

    return Response;
}
