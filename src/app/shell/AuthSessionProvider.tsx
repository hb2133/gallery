'use client';

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import {
    GetCurrentAuthUser,
    SignInWithEmailAndPassword,
    SignOutCurrentUser,
    SubscribeToAuthSession,
} from '@/managers/AuthManager';

interface AuthSessionContextValue
{
    IsAuthenticated: boolean;
    IsLoading: boolean;
    UserEmail: string | null;
    SignIn: (
        Email: string,
        Password: string,
    ) => Promise<string | null>;
    SignOut: () => Promise<void>;
}

interface AuthSessionProviderProps
{
    Children: ReactNode;
    InitialUserEmail: string | null;
}

const AuthSessionContext =
    createContext<AuthSessionContextValue | null>(null);

function GetAdminEmail(User: User | null): string | null
{
    if(User?.app_metadata.role !== 'admin')
    {
        return null;
    }

    return User.email ?? null;
}

export function AuthSessionProvider({
    Children,
    InitialUserEmail,
}: AuthSessionProviderProps)
{
    const [IsLoading, SetIsLoading] = useState(false);
    const [UserEmail, SetUserEmail] = useState<string | null>(
        InitialUserEmail,
    );

    useEffect(() =>
    {
        let IsMounted = true;

        void GetCurrentAuthUser().then((User) =>
        {
            if(IsMounted == false)
            {
                return;
            }

            SetUserEmail(GetAdminEmail(User));
            SetIsLoading(false);
        });

        const Subscription = SubscribeToAuthSession(
            (_Event, Session) =>
            {
                if(IsMounted == false)
                {
                    return;
                }

                SetUserEmail(
                    GetAdminEmail(Session?.user ?? null),
                );
                SetIsLoading(false);
            },
        );

        return () =>
        {
            IsMounted = false;
            Subscription.Unsubscribe();
        };
    }, []);

    const IsAuthenticated = UserEmail !== null;

    useEffect(() =>
    {
        document.documentElement.dataset.adminAuthenticated =
            IsAuthenticated ? 'true' : 'false';
    }, [IsAuthenticated]);

    const Value = useMemo<AuthSessionContextValue>(() =>
    {
        return {
            IsAuthenticated,
            IsLoading,
            UserEmail,
            SignIn: async (Email, Password) =>
            {
                const Result = await SignInWithEmailAndPassword(
                    Email,
                    Password,
                );

                return Result.ErrorCode;
            },
            SignOut: SignOutCurrentUser,
        };
    }, [IsAuthenticated, IsLoading, UserEmail]);

    return (
        <AuthSessionContext.Provider value={Value}>
            {Children}
        </AuthSessionContext.Provider>
    );
}

export function UseAuthSession(): AuthSessionContextValue
{
    const Context = useContext(AuthSessionContext);

    if(Context === null)
    {
        throw new Error(
            'UseAuthSession must be used inside AuthSessionProvider.',
        );
    }

    return Context;
}
