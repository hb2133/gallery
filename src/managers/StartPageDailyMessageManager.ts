'use client';

import {
    useEffect,
    useState,
} from 'react';
import {
    CacheStartPageCustomization,
    LoadStartPageCustomization,
} from '@/managers/StartPageCustomizationManager';

export function useStartPageDailyMessages(
    ProvidedMessages?: readonly string[],
    InitialMessages: readonly string[] = [],
)
{
    const [SharedMessages, SetSharedMessages] = useState<
        readonly string[]
    >(InitialMessages);

    useEffect(() =>
    {
        if(ProvidedMessages !== undefined)
        {
            return;
        }

        let IsMounted = true;

        void LoadStartPageCustomization().then(
            (Customization) =>
            {
                if(IsMounted === false)
                {
                    return;
                }

                CacheStartPageCustomization(Customization);
                SetSharedMessages(
                    Customization.DailyMessages,
                );
            },
        );

        return () =>
        {
            IsMounted = false;
        };
    }, [ProvidedMessages]);

    return ProvidedMessages ?? SharedMessages;
}
