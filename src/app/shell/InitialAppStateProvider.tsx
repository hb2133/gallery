'use client';

import {
    createContext,
    useContext,
    type ReactNode,
} from 'react';
import type { InitialAppState } from '@/managers/InitialAppStateManager';

interface InitialAppStateProviderProps
{
    Children: ReactNode;
    InitialState: InitialAppState;
}

const InitialAppStateContext =
    createContext<InitialAppState | null>(null);

export function InitialAppStateProvider(
    Props: InitialAppStateProviderProps,
)
{
    return (
        <InitialAppStateContext.Provider
            value={Props.InitialState}
        >
            {Props.Children}
        </InitialAppStateContext.Provider>
    );
}

export function UseInitialAppState(): InitialAppState
{
    const Context = useContext(InitialAppStateContext);

    if(Context === null)
    {
        throw new Error(
            'UseInitialAppState must be used inside InitialAppStateProvider.',
        );
    }

    return Context;
}
