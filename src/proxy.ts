import type { NextRequest } from 'next/server';
import { UpdateSupabaseSession } from '@/core/infra/supabase/SupabaseSessionProxy';

export async function proxy(Request: NextRequest)
{
    return UpdateSupabaseSession(Request);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
