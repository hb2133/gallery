import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { GetSupabaseBrowserClient } from '@/core/infra/supabase/SupabaseBrowserClient';

export interface AuthLoginResult
{
    ErrorCode: string | null;
}

export interface AuthSessionSubscription
{
    Unsubscribe: () => void;
}

export async function GetCurrentAuthUser(): Promise<User | null>
{
    const Supabase = GetSupabaseBrowserClient();
    const { data, error } = await Supabase.auth.getUser();

    if(error)
    {
        return null;
    }

    return data.user;
}

export async function SignInWithEmailAndPassword(
    Email: string,
    Password: string,
): Promise<AuthLoginResult>
{
    const Supabase = GetSupabaseBrowserClient();
    const { data, error } = await Supabase.auth.signInWithPassword({
        email: Email,
        password: Password,
    });

    if(error)
    {
        return {
            ErrorCode: error.code ?? 'authentication_failed',
        };
    }

    if(data.user.app_metadata.role !== 'admin')
    {
        await Supabase.auth.signOut();

        return {
            ErrorCode: 'admin_access_required',
        };
    }

    return {
        ErrorCode: null,
    };
}

export async function SignOutCurrentUser(): Promise<void>
{
    const Supabase = GetSupabaseBrowserClient();
    const { error } = await Supabase.auth.signOut();

    if(error)
    {
        throw error;
    }
}

export function SubscribeToAuthSession(
    OnSessionChanged: (
        Event: AuthChangeEvent,
        Session: Session | null,
    ) => void,
): AuthSessionSubscription
{
    const Supabase = GetSupabaseBrowserClient();
    const { data } = Supabase.auth.onAuthStateChange(
        OnSessionChanged,
    );

    return {
        Unsubscribe: () =>
        {
            data.subscription.unsubscribe();
        },
    };
}
